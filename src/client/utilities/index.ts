export const isDifferentDate = (dateString1: string, dateString2: string) => {
  const date1 = new Date(dateString1).toLocaleDateString();
  const date2 = new Date(dateString2).toLocaleDateString();
  return date1 !== date2;
}
export const getDateLabel = (dateStr: string): string => {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  const date = new Date(dateStr).toLocaleDateString()
  if (date === today) return 'Today';
  if (date === yesterdayStr) return 'Yesterday';
  return date;
};