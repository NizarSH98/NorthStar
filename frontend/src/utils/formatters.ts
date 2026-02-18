export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCorroborationColor = (state: string): string => {
  switch (state) {
    case 'multi-source-independent':
      return '#10b981'; // green
    case 'disputed':
      return '#f59e0b'; // amber
    case 'single-source':
      return '#6b7280'; // gray
    default:
      return '#6b7280';
  }
};

export const getCorroborationLabel = (state: string): string => {
  switch (state) {
    case 'multi-source-independent':
      return 'Corroborated by Independent Sources';
    case 'disputed':
      return 'Disputed';
    case 'single-source':
      return 'Single Source';
    default:
      return state;
  }
};
