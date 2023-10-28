import { format } from 'date-fns';

export const getMDYFromDate = (date: string) => {
  const newDate = new Date(date);
  return format(newDate, 'MM-dd-yyyy')
}