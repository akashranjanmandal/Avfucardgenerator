function pad(n) {
  return String(n).padStart(2, '0');
}

export function formatDMY(date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function todayDMY() {
  return formatDMY(new Date());
}

// Accepts DD.MM.YYYY, DD-MM-YYYY or DD/MM/YYYY.
export function parseFlexibleDate(str) {
  if (!str) return null;
  const match = String(str).trim().match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

// Given a "date of issue" string, returns the matching "valid upto" string
// (issue date + `years`), or '' if the issue date couldn't be parsed.
export function validUptoFromIssue(issueStr, years = 2) {
  const issueDate = parseFlexibleDate(issueStr);
  return issueDate ? formatDMY(addYears(issueDate, years)) : '';
}
