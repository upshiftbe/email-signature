import { z } from 'zod';
import { isSafeUrl } from './security';

// URL validation helper - ensures only safe protocols
const urlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val.trim()) return true; // Empty is allowed (optional fields)
      try {
        const url = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
        return isSafeUrl(url);
      } catch {
        return false;
      }
    },
    { message: 'Please enter a valid URL (http:// or https://)' }
  )
  .optional();

// Email validation helper
const emailSchema = z
  .string()
  .refine(
    (val) => {
      if (!val.trim()) return true; // Empty is allowed (optional fields)
      return z.string().email().safeParse(val).success;
    },
    { message: 'Please enter a valid email address' }
  )
  .optional();

// Phone validation helper (supports international formats)
const phoneSchema = z.string().optional();

// Form validation schema
export const formSchema = z.object({
  'input-naam': z.string().max(400, 'Name is too long (max 400 characters)'),
  'input-functie': z.string().max(400, 'Role is too long (max 400 characters)'),
  'input-gsm': phoneSchema,
  'input-email': emailSchema,
  'input-locatie-1': z.string().max(500, 'Location is too long (max 500 characters)'),
  'input-locatie-2': z.string().max(500, 'Location is too long (max 500 characters)').optional(),
  'input-facebook': urlSchema,
  'input-linkedin': urlSchema,
  'input-instagram': urlSchema,
  'input-website': urlSchema,
});

export type FormSchema = z.infer<typeof formSchema>;

// Validate a single field
export function validateField(fieldId: string, value: string): string | undefined {
  try {
    const fieldSchema = formSchema.shape[fieldId as keyof typeof formSchema.shape];
    if (!fieldSchema) return undefined;

    fieldSchema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message;
    }
    return 'Invalid value';
  }
}

// Validate entire form
export function validateForm(formState: Record<string, string>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  try {
    formSchema.parse(formState);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path) {
          errors[path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
}
