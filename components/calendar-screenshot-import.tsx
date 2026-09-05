"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "management-dashboard.calendar-screenshot";
const STORAGE_NAME_KEY = `${STORAGE_KEY}.name`;
const STORAGE_EVENTS_KEY = `${STORAGE_KEY}.events`;

type ExtractedEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  details: string[];
  confidence: number;
};

type LegacyStoredEvent = {
  id?: string;
  title?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  details?: string[];
  confidence?: number;
};

type OcrLine = {
  text: string;
  confidence: number;
  y0: number;
  y1: number;
};

type Segment = {
  y0: number;
  y1: number;
};

type TimeRange = {
  start?: string;
  end?: string;
};

function confidenceText(confidence: number): string {
  if (confidence >= 80) return "hoch";
  if (confidence >= 60) return "mittel";
  return "niedrig";
}

function parseTimeToken(token: string): string | null {
  const cleaned = token.replace(".", ":");
  const match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function extractLeadingTime(lineText: string): { time: string; rest: string } | null {
  const match = lineText.match(/^\s*([01]?\d|2[0-3])[:.]([0-5]\d)\b\s*(.*)$/i);
  if (!match) return null;

  const time = parseTimeToken(`${match[1]}:${match[2]}`);
  if (!time) return null;

  return {
    time,
    rest: (match[3] ?? "").trim(),
  };
}

function extractTimeRange(lineText: string): { start?: string; end?: string } | null {
  const rangeMatch = lineText.match(
    /(\d{1,2}(?::|\.)\d{2})\s*(?:uhr)?\s*(?:bis|-|–)\s*(\d{1,2}(?::|\.)\d{2}|\d{1,2})\s*(?:uhr)?/i,
  );
  if (!rangeMatch) return null;

  const startToken = rangeMatch[1].includes(":") || rangeMatch[1].includes(".") ? rangeMatch[1] : `${rangeMatch[1]}:00`;
  const endToken = rangeMatch[2].includes(":") || rangeMatch[2].includes(".") ? rangeMatch[2] : `${rangeMatch[2]}:00`;

  const start = parseTimeToken(startToken);
  const end = parseTimeToken(endToken);

  if (!start && !end) return null;
  return { start: start ?? undefined, end: end ?? undefined };
}

function extractFirstTime(lineText: string): string | null {
  const match = lineText.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
  if (!match) return null;
  return parseTimeToken(`${match[1]}:${match[2]}`);
}

function isLikelyMetadataLine(lineText: string): boolean {
  return /((uhr\s*(bis|-|–))|\bbis\b|\bmin\b|\bstd\b|\bstunden\b|\braum\b|\blocation\b|\bteams\b|\bzoom\b|\bonline\b|\bmeeting id\b)/i.test(
    lineText,
  );
}

function stripTimeAndRangeTokens(lineText: string): string {
  return lineText
    .replace(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b\s*(uhr)?/gi, "")
    .replace(/\b(bis|-|–)\b/gi, " ")
    .replace(/@?\s*microsoft\s*teams\s*-?\s*besprechung/gi, "")
    .replace(/@?\s*microsoft\s*teams\s*-?\s*meeting/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildEventFromLineGroup(group: OcrLine[], fallbackIndex: number): ExtractedEvent | null {
  if (group.length === 0) return null;

  const sorted = [...group].sort((left, right) => left.y0 - right.y0);

  const range: TimeRange = {};
  let firstTime: string | null = null;

  const titleLines: string[] = [];
  const detailLines: string[] = [];

  for (const line of sorted) {
    const raw = line.text.replace(/\s+/g, " ").trim();
    if (!raw) continue;

    const detectedRange = extractTimeRange(raw);
    if (detectedRange?.start && !range.start) range.start = detectedRange.start;
    if (detectedRange?.end && !range.end) range.end = detectedRange.end;

    if (!firstTime) {
      firstTime = extractFirstTime(raw);
    }

    const cleaned = stripTimeAndRangeTokens(raw);
    if (!cleaned) continue;

    if (isLikelyMetadataLine(raw)) {
      detailLines.push(cleaned);
    } else if (titleLines.length < 2) {
      titleLines.push(cleaned);
    } else {
      detailLines.push(cleaned);
    }
  }

  const title = titleLines.join(" ").replace(/\s+/g, " ").trim() || "Termin";
  const startTime = range.start ?? firstTime ?? "??:??";
  const confidence = Math.round(sorted.reduce((sum, line) => sum + line.confidence, 0) / sorted.length);

  return {
    id: `${startTime}-${title}-${fallbackIndex}`,
    title,
    startTime,
    endTime: range.end,
    details: detailLines,
    confidence,
  };
}

function parseEventsBySegments(lines: OcrLine[], segments: Segment[]): ExtractedEvent[] {
  if (segments.length === 0) return [];

  const groups = segments
    .map((segment) => {
      const members = lines.filter((line) => {
        const middle = (line.y0 + line.y1) / 2;
        return middle >= segment.y0 - 8 && middle <= segment.y1 + 8;
      });
      return members;
    })
    .filter((group) => group.length > 0);

  return groups
    .map((group, index) => buildEventFromLineGroup(group, index))
    .filter((event): event is ExtractedEvent => event !== null)
    .slice(0, 40);
}

function parseEventsByTimeAnchors(lines: OcrLine[]): ExtractedEvent[] {
  const ordered = [...lines].sort((left, right) => left.y0 - right.y0);
  const events: ExtractedEvent[] = [];

  let active: ExtractedEvent | null = null;

  const pushActive = () => {
    if (!active) return;
    active.title = active.title.trim() || "Termin";
    events.push(active);
    active = null;
  };

  for (const line of ordered) {
    const raw = line.text.replace(/\s+/g, " ").trim();
    if (!raw) continue;

    const lead = extractLeadingTime(raw);
    const range = extractTimeRange(raw);

    if (lead) {
      pushActive();
      active = {
        id: `${lead.time}-${events.length}`,
        title: lead.rest || "Termin",
        startTime: lead.time,
        endTime: range?.end,
        details: [],
        confidence: Math.round(line.confidence),
      };
      continue;
    }

    if (!active) continue;

    if (range?.end && !active.endTime) {
      active.endTime = range.end;
    }

    const cleaned = stripTimeAndRangeTokens(raw);
    if (!cleaned) continue;

    if (!isLikelyMetadataLine(raw) && active.title.length < 80) {
      active.title = `${active.title} ${cleaned}`.replace(/\s+/g, " ").trim();
    } else {
      active.details.push(cleaned);
    }
  }

  pushActive();
  return events.slice(0, 40);
}

function parseEventsFromOcrLines(lines: OcrLine[], segments: Segment[]): ExtractedEvent[] {
  const bySegments = parseEventsBySegments(lines, segments);
  const byAnchors = parseEventsByTimeAnchors(lines);

  if (bySegments.length >= 2) {
    return bySegments;
  }

  return byAnchors.length > 0 ? byAnchors : bySegments;
}

function loadStoredEvents(): ExtractedEvent[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_EVENTS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LegacyStoredEvent[];
    if (!Array.isArray(parsed)) return [];

    return parsed.reduce<ExtractedEvent[]>((accumulator, event, index) => {
      const startTime = event.startTime ?? event.time;
      if (!startTime || !event.title) return accumulator;

      accumulator.push({
        id: event.id ?? `${startTime}-${event.title}-${index}`,
        title: event.title,
        startTime,
        endTime: event.endTime,
        details: Array.isArray(event.details) ? event.details : [],
        confidence: typeof event.confidence === "number" ? event.confidence : 0,
      });

      return accumulator;
    }, []);
  } catch {
    return [];
  }
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
    image.src = dataUrl;
  });
}

async function preprocessImageForOcr(dataUrl: string): Promise<{ image: string; scaleY: number }> {
  const image = await loadImage(dataUrl);

  const scale = 2;
  const width = Math.min(Math.round(image.width * scale), 2600);
  const height = Math.round((width / image.width) * image.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { image: dataUrl, scaleY: 1 };

  context.drawImage(image, 0, 0, width, height);

  const frame = context.getImageData(0, 0, width, height);
  const data = frame.data;

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const contrasted = Math.min(255, Math.max(0, (luminance - 128) * 1.45 + 128));
    const binary = contrasted > 165 ? 255 : 0;

    data[index] = binary;
    data[index + 1] = binary;
    data[index + 2] = binary;
  }

  context.putImageData(frame, 0, 0);

  return {
    image: canvas.toDataURL("image/png", 1),
    scaleY: height / image.height,
  };
}

function isBluePixel(r: number, g: number, b: number): boolean {
  return b >= 90 && b - Math.max(r, g) >= 20 && g <= 210;
}

async function detectBlueEventSegments(dataUrl: string): Promise<Segment[]> {
  const image = await loadImage(dataUrl);

  const width = Math.min(image.width, 1800);
  const height = Math.round((width / image.width) * image.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];

  context.drawImage(image, 0, 0, width, height);
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;

  const colorCountPerColumn = new Array<number>(width).fill(0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (isBluePixel(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
        colorCountPerColumn[x] += 1;
      }
    }
  }

  const columnThreshold = Math.max(12, Math.round(height * 0.05));
  const candidateColumns: number[] = [];

  for (let x = 0; x < width; x += 1) {
    if (colorCountPerColumn[x] >= columnThreshold) {
      candidateColumns.push(x);
    }
  }

  if (candidateColumns.length === 0) return [];

  const centerColumns: number[] = [];
  let groupStart = candidateColumns[0];
  let previous = candidateColumns[0];

  for (let index = 1; index < candidateColumns.length; index += 1) {
    const current = candidateColumns[index];
    if (current <= previous + 2) {
      previous = current;
      continue;
    }

    centerColumns.push(Math.round((groupStart + previous) / 2));
    groupStart = current;
    previous = current;
  }
  centerColumns.push(Math.round((groupStart + previous) / 2));

  const rawRuns: Segment[] = [];

  const pixelIsBlueAt = (x: number, y: number): boolean => {
    for (let dx = -1; dx <= 1; dx += 1) {
      const sampleX = x + dx;
      if (sampleX < 0 || sampleX >= width) continue;
      const offset = (y * width + sampleX) * 4;
      if (isBluePixel(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
        return true;
      }
    }
    return false;
  };

  for (const x of centerColumns) {
    let runStart: number | null = null;

    for (let y = 0; y < height; y += 1) {
      const blue = pixelIsBlueAt(x, y);
      if (blue && runStart === null) {
        runStart = y;
      }

      if (!blue && runStart !== null) {
        const runHeight = y - runStart;
        if (runHeight >= 24) {
          rawRuns.push({ y0: runStart, y1: y - 1 });
        }
        runStart = null;
      }
    }

    if (runStart !== null && height - runStart >= 24) {
      rawRuns.push({ y0: runStart, y1: height - 1 });
    }
  }

  if (rawRuns.length === 0) return [];

  rawRuns.sort((left, right) => left.y0 - right.y0);

  const merged: Segment[] = [];
  for (const run of rawRuns) {
    const last = merged.at(-1);
    if (!last || run.y0 > last.y1 + 10) {
      merged.push({ ...run });
      continue;
    }

    last.y0 = Math.min(last.y0, run.y0);
    last.y1 = Math.max(last.y1, run.y1);
  }

  const scaleBack = image.height / height;

  return merged
    .filter((segment) => segment.y1 - segment.y0 >= 24)
    .map((segment) => ({
      y0: Math.round(segment.y0 * scaleBack),
      y1: Math.round(segment.y1 * scaleBack),
    }))
    .slice(0, 40);
}

export function CalendarScreenshotImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  });
  const [fileName, setFileName] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_NAME_KEY);
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [events, setEvents] = useState<ExtractedEvent[]>(() => loadStoredEvents());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisConfidence, setAnalysisConfidence] = useState<number | null>(null);
  const [visualSegmentCount, setVisualSegmentCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasPreview = !!previewUrl;
  const hasEvents = events.length > 0;

  const workflowState = useMemo(() => {
    if (!hasPreview) return "Kein Import";
    if (isAnalyzing) return "Analyse läuft";
    if (!isConfirmed) return "Entwurf (noch nicht bestätigt)";
    if (hasEvents) return "Analyse abgeschlossen";
    return "Bestätigt (bereit für Analyse)";
  }, [hasEvents, hasPreview, isAnalyzing, isConfirmed]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Bitte eine Bilddatei auswählen (PNG, JPG, HEIC etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        setError("Screenshot konnte nicht gelesen werden.");
        return;
      }

      setError(null);
      setPreviewUrl(result);
      setFileName(file.name);
      setIsConfirmed(false);
      setEvents([]);
      setAnalysisConfidence(null);
      setVisualSegmentCount(null);

      window.localStorage.setItem(STORAGE_KEY, result);
      window.localStorage.setItem(STORAGE_NAME_KEY, file.name);
      window.localStorage.removeItem(STORAGE_EVENTS_KEY);
    };

    reader.onerror = () => setError("Screenshot konnte nicht importiert werden.");
    reader.readAsDataURL(file);
  };

  const openPicker = () => inputRef.current?.click();

  const confirmImport = () => {
    if (!previewUrl) return;
    setError(null);
    setIsConfirmed(true);
  };

  const analyzeScreenshot = async () => {
    if (!previewUrl || !isConfirmed) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const [prepared, rawSegments] = await Promise.all([
        preprocessImageForOcr(previewUrl),
        detectBlueEventSegments(previewUrl),
      ]);

      const scaledSegments = rawSegments.map((segment) => ({
        y0: Math.round(segment.y0 * prepared.scaleY),
        y1: Math.round(segment.y1 * prepared.scaleY),
      }));

      const tesseract = await import("tesseract.js");
      const worker = await tesseract.createWorker("deu+eng");
      await worker.setParameters({
        tessedit_pageseg_mode: tesseract.PSM.SINGLE_BLOCK,
        preserve_interword_spaces: "1",
      });

      const result = await worker.recognize(prepared.image, {}, { text: true, blocks: true });
      await worker.terminate();

      const blocks = result.data.blocks ?? [];
      const lines: OcrLine[] = blocks
        .flatMap((block) => block.paragraphs)
        .flatMap((paragraph) => paragraph.lines)
        .map((line) => ({
          text: line.text.trim(),
          confidence: Number(line.confidence ?? 0),
          y0: Number(line.bbox?.y0 ?? 0),
          y1: Number(line.bbox?.y1 ?? 0),
        }))
        .filter((line) => line.text.length > 0);

      const parsedEvents = parseEventsFromOcrLines(lines, scaledSegments);
      const avgConfidence =
        lines.length > 0 ? Math.round(lines.reduce((sum, line) => sum + line.confidence, 0) / lines.length) : null;

      setAnalysisConfidence(avgConfidence);
      setVisualSegmentCount(rawSegments.length);
      setEvents(parsedEvents);
      window.localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(parsedEvents));

      if (parsedEvents.length === 0) {
        setError("Keine Termine erkannt. Bitte enger zuschneiden oder Kontrast erhöhen.");
      }
    } catch (ocrError) {
      console.error(ocrError);
      setError("Die lokale KI-Analyse konnte nicht ausgeführt werden.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImport = () => {
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    setIsConfirmed(false);
    setEvents([]);
    setAnalysisConfidence(null);
    setVisualSegmentCount(null);

    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_NAME_KEY);
    window.localStorage.removeItem(STORAGE_EVENTS_KEY);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-semibold text-slate-100">Kalender-Screenshot importieren</h2>
      <p className="mt-2 text-sm text-slate-300">
        Workflow: Screenshot importieren, Import bestätigen, lokale KI-Analyse starten und erkannte Termine prüfen.
      </p>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
        Status: <span className="font-medium text-slate-100">{workflowState}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openPicker}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          Screenshot importieren
        </button>

        {hasPreview ? (
          <button
            type="button"
            onClick={confirmImport}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Import bestätigen
          </button>
        ) : null}

        {hasPreview ? (
          <button
            type="button"
            onClick={analyzeScreenshot}
            disabled={!isConfirmed || isAnalyzing}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analysiere..." : "Mit KI analysieren"}
          </button>
        ) : null}

        {hasPreview ? (
          <button
            type="button"
            onClick={clearImport}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Import entfernen
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      {previewUrl ? (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Aktueller Import</p>
          <p className="mt-1 text-sm text-slate-300">{fileName ?? "Unbekannte Datei"}</p>
          <Image
            src={previewUrl}
            alt="Importierter Kalender-Screenshot"
            width={1400}
            height={900}
            unoptimized
            className="mt-3 max-h-[30rem] w-full rounded-lg border border-slate-800 object-contain"
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Noch kein Screenshot importiert.</p>
      )}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Erkannte Termine (lokaler Test)</p>
        {analysisConfidence !== null ? (
          <p className="mt-2 text-sm text-slate-300">
            OCR-Qualität: <span className="font-medium text-slate-100">{analysisConfidence}%</span> (
            {confidenceText(analysisConfidence)})
          </p>
        ) : null}
        {visualSegmentCount !== null ? (
          <p className="mt-1 text-sm text-slate-300">
            Visuelle Terminsegmente (blaue Linien): <span className="font-medium text-slate-100">{visualSegmentCount}</span>
          </p>
        ) : null}

        {hasEvents ? (
          <ul className="mt-3 space-y-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
                <span className="font-medium text-slate-100">
                  {event.startTime}
                  {event.endTime ? `–${event.endTime}` : ""}
                </span>
                <span className="ml-2 text-slate-300">{event.title}</span>
                <span className="ml-2 text-xs text-slate-500">
                  ({event.confidence}% {confidenceText(event.confidence)})
                </span>
                {(event.details ?? []).length > 0 ? (
                  <p className="mt-1 text-xs text-slate-400">{(event.details ?? []).join(" · ")}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Noch keine Termine erkannt.</p>
        )}
      </div>
    </section>
  );
}
