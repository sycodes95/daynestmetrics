import { format } from 'date-fns';

export const getYMDFromDate = (date: string) => {
  const newDate = new Date(date);
  return format(newDate, 'yyyy-MM-dd')
}