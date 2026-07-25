export function toISODate(dateString) {
  const date = new Date(dateString);

  return date.toISOString();
}

export function toBBDFormat(dateString) {
  const date = new Date(dateString);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = String(date.getDate()).padStart(2, "0");

  const month = months[date.getMonth()];

  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

export function toDisplayDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year}`;
}
