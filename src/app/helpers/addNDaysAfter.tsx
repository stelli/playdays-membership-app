export default function addNDaysAfter({
  startDate,
  days,
}: {
  startDate: Date;
  days: number;
}) {
  return startDate.getTime() + days * 24 * 60 * 60 * 1000;
}
