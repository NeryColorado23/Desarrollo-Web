/**
 * Valida que el DPI tenga exactamente 13 dígitos numéricos
 */
const validateDPI = (dpi) => {
  const dpiRegex = /^\d{13}$/;
  return dpiRegex.test(dpi);
};

/**
 * Valida que el email tenga un formato válido
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que el password tenga:
 * - Al menos 8 caracteres
 * - Al menos una mayúscula
 * - Al menos un número
 * - Al menos un símbolo
 */
const validatePassword = (password) => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasUpperCase && hasNumber && hasSymbol;
};

/**
 * Valida todos los campos requeridos para crear un usuario
 */
const validateUserData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('El nombre es requerido');
  }
  
  if (!data.dpi) {
    errors.push('El DPI es requerido');
  } else if (!validateDPI(data.dpi)) {
    errors.push('El DPI debe tener exactamente 13 dígitos numéricos');
  }
  
  if (!data.email) {
    errors.push('El email es requerido');
  } else if (!validateEmail(data.email)) {
    errors.push('El email no tiene un formato válido');
  }
  
  if (!data.password) {
    errors.push('El password es requerido');
  } else if (!validatePassword(data.password)) {
    errors.push('El password debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateDPI,
  validateEmail,
  validatePassword,
  validateUserData
};