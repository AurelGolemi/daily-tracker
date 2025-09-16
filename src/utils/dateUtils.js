// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

// Check if a date is today
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Get today's date in YYYY-MM-DD format
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// Check if a date string is from today
export const isDateToday = (dateString) => {
  if (!dateString) return false;
  const today = getTodayDateString();
  return dateString === today;
};