

export const getTimeAgo = (createdAt) => {
    const createdAgo = Date.now() - Date.parse(createdAt);

  const seconds = Math.floor(createdAgo / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);

  if (seconds < 60) return `0 mins ago`;
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  return `${months} ${months === 1 ? 'month' : 'months'} ago`;
}