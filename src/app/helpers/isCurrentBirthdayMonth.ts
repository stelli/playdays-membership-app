export default function isCurrentBirthdateMonth(memberBirthDate: string) {
  const birthMonth = new Date(memberBirthDate).getMonth();
  const currentMonth = new Date().getMonth();

  return birthMonth === currentMonth;
}
