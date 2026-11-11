import { BUSINESS } from "@/lib/business";

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${suffix}`;
}

export interface OpenStatus {
  isOpen: boolean;
  /** Short line such as "Open now until 10 PM" or "Closed, opens 10 AM". */
  label: string;
}

/** Store open/closed status, always evaluated in the store's own time zone. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = DAY_INDEX[get("weekday")] ?? 0;
  const time = Number(get("hour")) + Number(get("minute")) / 60;
  const today = BUSINESS.hoursByDay[day];

  if (time >= today.open && time < today.close) {
    return { isOpen: true, label: `Open now until ${formatHour(today.close)}` };
  }
  if (time < today.open) {
    return { isOpen: false, label: `Closed, opens ${formatHour(today.open)}` };
  }
  const tomorrow = BUSINESS.hoursByDay[(day + 1) % 7];
  return {
    isOpen: false,
    label: `Closed, opens ${formatHour(tomorrow.open)} tomorrow`,
  };
}
