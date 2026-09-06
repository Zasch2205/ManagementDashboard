import { NextResponse } from "next/server";
import type { CalendarEvent, NextcloudSyncResult } from "@/lib/calendar-types";

function parseShare(shareUrl: string): { origin: string; token: string } | null {
  const match = shareUrl.match(/^(https?:\/\/[^/]+)\/s\/([^/?#]+)/i);
  if (!match) return null;
  return { origin: match[1], token: match[2] };
}

function basicAuth(token: string): string {
  return `Basic ${Buffer.from(`${token}:`).toString("base64")}`;
}

function decodeXmlValue(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xml.match(regex);
  if (!match) return null;
  return decodeXmlValue(match[1].trim());
}

function parseMultistatusForIcs(xml: string): { href: string; fileName: string; lastModified: string } | null {
  const responses = [...xml.matchAll(/<d:response>([\s\S]*?)<\/d:response>/gi)].map((entry) => entry[1]);

  for (const response of responses) {
    const href = extractTag(response, "d:href");
    const contentType = extractTag(response, "d:getcontenttype");
    if (!href || !contentType) continue;

    const isCalendar = contentType.toLowerCase().includes("text/calendar") || href.toLowerCase().endsWith(".ics");
    if (!isCalendar) continue;

    const lastModified = extractTag(response, "d:getlastmodified") ?? new Date().toUTCString();
    const rawName = href.split("/").filter(Boolean).at(-1) ?? "calendar.ics";
    const fileName = decodeURIComponent(rawName);

    return { href, fileName, lastModified };
  }

  return null;
}

function unfoldIcs(content: string): string[] {
  const rows = content.replace(/\r\n?/g, "\n").split("\n");
  const unfolded: string[] = [];

  for (const row of rows) {
    if ((row.startsWith(" ") || row.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += row.trimStart();
    } else {
      unfolded.push(row);
    }
  }

  return unfolded;
}

function parseIcsDate(value: string): Date | null {
  if (/^\d{8}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));
    return new Date(year, month - 1, day, 0, 0, 0);
  }

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(9, 11));
    const minute = Number(value.slice(11, 13));
    const second = Number(value.slice(13, 15));
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  }

  if (/^\d{8}T\d{6}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(9, 11));
    const minute = Number(value.slice(11, 13));
    const second = Number(value.slice(13, 15));
    return new Date(year, month - 1, day, hour, minute, second);
  }

  return null;
}

function parseEventsFromIcs(content: string): CalendarEvent[] {
  const lines = unfoldIcs(content);
  const events: CalendarEvent[] = [];

  let inEvent = false;
  let uid = "";
  let summary = "";
  let location = "";
  let dtStart = "";
  let dtEnd = "";

  const pushEvent = () => {
    if (!dtStart) return;

    const startDate = parseIcsDate(dtStart);
    const endDate = dtEnd ? parseIcsDate(dtEnd) : null;
    if (!startDate) return;

    events.push({
      id: uid || `${dtStart}-${summary}-${events.length}`,
      title: summary || "Termin",
      location: location || undefined,
      startIso: startDate.toISOString(),
      endIso: endDate ? endDate.toISOString() : undefined,
    });
  };

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      uid = "";
      summary = "";
      location = "";
      dtStart = "";
      dtEnd = "";
      continue;
    }

    if (line === "END:VEVENT") {
      pushEvent();
      inEvent = false;
      continue;
    }

    if (!inEvent) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).toUpperCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (key.startsWith("UID")) uid = value;
    if (key.startsWith("SUMMARY")) summary = value;
    if (key.startsWith("LOCATION")) location = value;
    if (key.startsWith("DTSTART")) dtStart = value;
    if (key.startsWith("DTEND")) dtEnd = value;
  }

  return events.sort((left, right) => left.startIso.localeCompare(right.startIso));
}

export async function GET() {
  const shareUrl = process.env.NEXTCLOUD_SHARE_URL ?? "https://share.ard-zdf-box.de/s/jqHjqkDyw9TGsHn";
  const share = parseShare(shareUrl);

  if (!share) {
    return NextResponse.json({ error: "Ungültige NEXTCLOUD_SHARE_URL" }, { status: 500 });
  }

  try {
    const davUrl = `${share.origin}/public.php/dav/files/${share.token}/`;

    const propfindResponse = await fetch(davUrl, {
      method: "PROPFIND",
      headers: {
        Depth: "1",
        Authorization: basicAuth(share.token),
      },
      cache: "no-store",
    });

    if (!propfindResponse.ok) {
      return NextResponse.json({ error: "Nextcloud-Share nicht erreichbar" }, { status: 502 });
    }

    const multistatusXml = await propfindResponse.text();
    const fileInfo = parseMultistatusForIcs(multistatusXml);

    if (!fileInfo) {
      return NextResponse.json({ error: "Keine .ics-Datei im Share gefunden" }, { status: 404 });
    }

    const fileUrl = `${share.origin}${fileInfo.href}`;
    const fileResponse = await fetch(fileUrl, {
      method: "GET",
      headers: {
        Authorization: basicAuth(share.token),
      },
      cache: "no-store",
    });

    if (!fileResponse.ok) {
      return NextResponse.json({ error: "ICS-Datei konnte nicht geladen werden" }, { status: 502 });
    }

    const icsContent = await fileResponse.text();
    const events = parseEventsFromIcs(icsContent);

    const result: NextcloudSyncResult = {
      sourceFileName: fileInfo.fileName,
      synchronizationDate: new Date(fileInfo.lastModified).toISOString(),
      events,
    };

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Synchronisation fehlgeschlagen" }, { status: 500 });
  }
}
