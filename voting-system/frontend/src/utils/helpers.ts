// src/utils/helpers.ts

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleDateString('es-GT', options);
};

/**
 * Formatea solo la fecha sin hora
 */
export const formatDateOnly = (date: string | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString('es-GT', options);
};

/**
 * Calcula el tiempo restante hasta una fecha
 */
export const calculateTimeRemaining = (endDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const difference = end - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Formatea el tiempo restante en string legible
 */
export const formatTimeRemaining = (endDate: string | Date): string => {
  const time = calculateTimeRemaining(endDate);

  if (time.isExpired) {
    return 'Votación finalizada';
  }

  const parts: string[] = [];

  if (time.days > 0) {
    parts.push(`${time.days}d`);
  }
  if (time.hours > 0) {
    parts.push(`${time.hours}h`);
  }
  if (time.minutes > 0) {
    parts.push(`${time.minutes}m`);
  }
  if (time.seconds > 0 && time.days === 0) {
    parts.push(`${time.seconds}s`);
  }

  return parts.join(' ');
};

/**
 * Valida formato de DPI guatemalteco
 */
export const validateDPI = (dpi: string): boolean => {
  return /^\d{13}$/.test(dpi);
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que la fecha de nacimiento corresponda a mayor de edad
 */
export const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};

/**
 * Trunca texto largo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

/**
 * Genera un color aleatorio para avatares
 */
export const generateAvatarColor = (name: string): string => {
  const colors = [
    '#1e3a5f', // navy blue
    '#f4d03f', // yellow
    '#28a745', // green
    '#dc3545', // red
    '#17a2b8', // cyan
    '#6c757d', // gray
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Formatea número con separador de miles
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-GT');
};

/**
 * Calcula porcentaje
 */
export const calculatePercentage = (part: number, total: number): string => {
  if (total === 0) return '0.00';
  return ((part / total) * 100).toFixed(2);
};

/**
 * Descarga datos como JSON
 */
export const downloadJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Manejo de errores de API
 */
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};