export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "N/A";
  }

  const totalSeconds = parseFloat(seconds);
  if (totalSeconds < 0) return "N/A";
  if (totalSeconds === 0) return "0.00 detik";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} jam`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} menit`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs.toFixed(2)} detik`);
  }

  return parts.join(", ");
};
