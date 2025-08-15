// utils/dateTime.ts

/**
 * Convert form date/time inputs to database format WITHOUT timezone conversion
 */
export const formatForDatabase = (datePart: string, timePart: string) => {
  // Ensure time has seconds
  const time = timePart.length === 5 ? `${timePart}:00` : timePart;

  return {
    needed_date: datePart, // YYYY-MM-DD as-is
    needed_time: time, // HH:MM:SS as-is
  };
}

/**
 * Display date in Indonesian long format: "15 Januari 2025"
 */
export const formatDateLong = (dateStr: string): string => {
  if (!dateStr) return "";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  try {
    // Parse YYYY-MM-DD without timezone conversion
    const [year, month, day] = dateStr.split("-");
    const monthName = months[parseInt(month) - 1];

    return `${parseInt(day)} ${monthName} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
}


export const formatDate = (iso?: string) => {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });
}

/**
 * Display date in short format: "15/01/2025"
 */
export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return "";

  try {
    // Parse YYYY-MM-DD and convert to DD/MM/YYYY
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
}

export const formatDateShortStriped = (dateStr: string): string => {
  if (!dateStr) return "";

  try {
    // Parse YYYY-MM-DD and convert to DD/MM/YYYY
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
}

export const formatDateTime = (dateTimeStr: string): string =>  {
  if (!dateTimeStr) return "";

  try {
    const dateStr = dateTimeStr.split("T")[0];
    const timeStr = dateTimeStr.split("T")[1] || "00:00:00";
    // Parse YYYY-MM-DD and convert to DD/MM/YYYY
    return `${formatDateShortStriped(dateStr)} - ${formatTime24(timeStr)}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateTimeStr;
  }
}

export const formatDateOnly = (dateTimeStr: string): string =>  {
  if (!dateTimeStr) return "";

  try {
    const dateStr = dateTimeStr.split("T")[0];
    // Parse YYYY-MM-DD and convert to DD/MM/YYYY
    return `${formatDateShortStriped(dateStr)}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateTimeStr;
  }
}

/**
 * Display time in HH:MM format (24 hour)
 */
export const formatTime24 = (timeStr: string): string => {
  if (!timeStr) return "";

  try {
    // Extract HH:MM from HH:MM:SS or HH:MM
    const timeParts = timeStr.split(":");
    return `${timeParts[0]}:${timeParts[1]}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
}

export const formatTime12 = (timeStr: string): string => {
  if (!timeStr) return "";
  try {
    const [hours, minutes] = timeStr.split(":");
    const period = parseInt(hours) >= 12 ? "PM" : "AM";
    const formattedHours = ((parseInt(hours) + 11) % 12 + 1).toString().padStart(2, "0");
    return `${formattedHours}:${minutes} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
};

/**
 * Validate date string format (YYYY-MM-DD)
 */
export const isValidDateFormat = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // Check if it's a valid date
  const date = new Date(dateStr + "T00:00:00"); // Add time to avoid timezone issues
  return !isNaN(date.getTime());
}

/**
 * Validate time string format (HH:MM or HH:MM:SS)
 */
export const isValidTimeFormat = (timeStr: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return regex.test(timeStr);
}

/**
 * Check if date/time is in the future
 */
export const isFutureDateTime = (dateStr: string, timeStr: string): boolean => {
  if (!dateStr || !timeStr) return true; // Allow empty dates

  try {
    const time = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const inputDateTime = new Date(`${dateStr}T${time}`);
    const now = new Date();

    return inputDateTime.getTime() > now.getTime();
  } catch (error) {
    console.error("Error checking future date:", error);
    return false;
  }
}

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Get current time in HH:MM format
 */
export const getCurrentTime = (): string =>{
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

// Example usage:
/*
// For form submission:
const { needed_date, needed_time } = formatForDatabase("2025-01-15", "22:30");

// For display:
formatDateLong("2025-01-15");  // "15 Januari 2025"
formatDateShort("2025-01-15"); // "15/01/2025"  
formatTime("22:30:00");        // "22:30"

// For validation:
isValidDateFormat("2025-01-15");    // true
isValidTimeFormat("22:30");         // true
isFutureDateTime("2025-01-15", "22:30"); // true/false
*/
