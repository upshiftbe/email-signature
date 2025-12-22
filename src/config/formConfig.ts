import type { FormField, FormGroup } from '../types';

export const FORM_FIELDS: FormField[] = [
  { id: 'input-naam', label: 'Name', placeholder: 'Final boss' },
  { id: 'input-functie', label: 'Role', placeholder: 'Chiefest of chiefs' },
  { id: 'input-gsm', label: 'Phone', placeholder: '+32 470 01 23 45' },
  { id: 'input-email', label: 'Email', placeholder: 'hello@upshift.be' },
  {
    id: 'input-locatie-1',
    label: 'Primary location',
    placeholder: 'Antwerpen, België',
  },
  {
    id: 'input-locatie-2',
    label: 'Secondary location',
    placeholder: 'Brussel, België',
    hint: 'Optional, add a second office or department name',
  },
  {
    id: 'input-facebook',
    label: 'Facebook URL',
    placeholder: 'https://www.facebook.com/upshiftbe',
    type: 'url',
    hint: 'Optional, add a public page so colleagues can follow you',
  },
  {
    id: 'input-linkedin',
    label: 'LinkedIn URL',
    placeholder: 'https://www.linkedin.com/company/37812214/admin/dashboard/',
    type: 'url',
    hint: 'Optional, include the full URL for clickable links',
  },
  {
    id: 'input-instagram',
    label: 'Instagram URL',
    placeholder: 'https://instagram.com/company',
    type: 'url',
    hint: 'Optional, a second handle for the social bar',
  },
  {
    id: 'input-website',
    label: 'Website URL',
    placeholder: 'https://company.com',
    type: 'url',
    hint: 'Include https:// so recipients can tap the link',
  },
];

export const FORM_GROUPS: FormGroup[] = [
  {
    title: 'Identity',
    description: 'Capture the name and role that appear directly under your signature.',
    fieldIds: ['input-naam', 'input-functie'],
  },
  {
    title: 'Contact',
    description: 'Phone, email and website links are clickable for recipients.',
    fieldIds: ['input-gsm', 'input-email', 'input-website'],
  },
  {
    title: 'Location',
    description: 'Add primary and optional secondary offices or departments.',
    fieldIds: ['input-locatie-1', 'input-locatie-2'],
  },
  {
    title: 'Social',
    description: 'Optional public handles to share in your footer.',
    fieldIds: ['input-facebook', 'input-linkedin', 'input-instagram'],
  },
];

export const FIELD_MAP: Record<FormField['id'], FormField> = FORM_FIELDS.reduce(
  (acc, field) => {
    acc[field.id] = field;
    return acc;
  },
  {} as Record<FormField['id'], FormField>
);

export const PREFILL_VALUES: Record<FormField['id'], string> = {
  'input-facebook': 'https://www.facebook.com/upshiftbe',
  'input-linkedin': 'https://www.linkedin.com/company/37812214/admin/dashboard/',
};

export const STORAGE_KEY = 'signatureBuilderState';

export const RAW_ASSET_BASE = 'https://raw.githubusercontent.com/upshiftbe/email-signature/refs/heads/main/src/assets';
