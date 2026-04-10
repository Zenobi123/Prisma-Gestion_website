
export const parseActivityTime = (timeString: string) => {
  const now = new Date();

  if (timeString.startsWith("Il y a")) {
    const hours = parseInt(timeString.match(/\d+/)?.[0] || "0");
    const date = new Date(now);
    date.setHours(date.getHours() - hours);
    return date;
  } else if (timeString.startsWith("Hier")) {
    const [, time] = timeString.split("à ");
    const [hours, minutes] = time.trim().split(":");
    const date = new Date(now);
    date.setDate(date.getDate() - 1);
    date.setHours(parseInt(hours), parseInt(minutes));
    return date;
  } else {
    // Parse French date format "DD/MM/YYYY"
    const [day, month, year] = timeString.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
};
