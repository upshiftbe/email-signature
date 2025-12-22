/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

// Allowed URL protocols for security
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;

type AllowedProtocol = (typeof ALLOWED_PROTOCOLS)[number];

/**
 * Sanitizes a URL to prevent XSS attacks
 * Only allows http, https, mailto, and tel protocols
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url || !url.trim()) {
    return '';
  }

  const trimmed = url.trim();

  // Check if URL starts with an allowed protocol
  try {
    const urlObj = new URL(trimmed);
    const protocol = urlObj.protocol.toLowerCase();

    if (ALLOWED_PROTOCOLS.includes(protocol as AllowedProtocol)) {
      // Reconstruct URL to ensure it's properly formatted
      return urlObj.toString();
    }

    // If protocol is not allowed, return empty string
    return '';
  } catch {
    // If URL parsing fails, try to construct a safe URL
    // Only allow http/https for non-protocol URLs
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const urlObj = new URL(trimmed);
        return urlObj.toString();
      } catch {
        return '';
      }
    }

    // For URLs without protocol, default to https
    try {
      const urlObj = new URL(`https://${trimmed}`);
      return urlObj.toString();
    } catch {
      return '';
    }
  }
}

/**
 * Sanitizes a phone number for use in tel: links
 * Removes any potentially dangerous characters
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone || !phone.trim()) {
    return '';
  }

  // Remove all non-phone characters except +, digits, spaces, dashes, parentheses, and dots
  const sanitized = phone.trim().replace(/[^\d+\s\-().]/g, '');

  // Limit length to prevent abuse
  if (sanitized.length > 50) {
    return sanitized.substring(0, 50);
  }

  return sanitized;
}

/**
 * Sanitizes an email address for use in mailto: links
 * Validates email format and removes dangerous characters
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email || !email.trim()) {
    return '';
  }

  const trimmed = email.trim();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return '';
  }

  // Limit length to prevent abuse
  if (trimmed.length > 254) {
    return trimmed.substring(0, 254);
  }

  return trimmed;
}

/**
 * Escapes HTML special characters to prevent XSS
 * React does this by default, but this is explicit for text content
 */
export function escapeHtml(text: string | undefined | null): string {
  if (!text) {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Validates that a URL uses only safe protocols
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    const urlObj = new URL(url.trim());
    return ALLOWED_PROTOCOLS.includes(urlObj.protocol.toLowerCase() as AllowedProtocol);
  } catch {
    // If URL parsing fails, check if it's a relative URL or needs protocol
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const urlObj = new URL(trimmed);
        return ALLOWED_PROTOCOLS.includes(urlObj.protocol.toLowerCase() as AllowedProtocol);
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Sanitizes text content for display (removes HTML tags)
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) {
    return '';
  }

  // Remove any HTML tags
  return text.replace(/<[^>]*>/g, '').trim();
}
