export const PASSWORD_REGEX =   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Generic global postal code (3-10 characters, allows letters, numbers, spaces, and hyphens)
export const POSTAL_CODE = /^[a-zA-Z0-9\s-]{3,10}$/;

// Flexible phone number (Handles +1 (123) 456-7890, 123-456-7890, 1234567890, +91 9876543210)
export const PHONE_NO = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;