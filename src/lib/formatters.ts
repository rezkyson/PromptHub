const indonesiaDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const indonesiaDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | number | Date) {
  return indonesiaDateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | number | Date) {
  return indonesiaDateTimeFormatter.format(new Date(value));
}
