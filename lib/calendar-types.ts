export type CalendarEvent = {
  id: string;
  title: string;
  location?: string;
  startIso: string;
  endIso?: string;
};

export type NextcloudSyncResult = {
  sourceFileName: string;
  synchronizationDate: string;
  events: CalendarEvent[];
};
