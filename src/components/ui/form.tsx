import type { HTMLAttributes, ReactNode } from 'react';
import { Label } from './label';

type FieldProps = HTMLAttributes<HTMLDivElement> & { 'data-invalid'?: boolean };

export function Field({ children, className = '', ...rest }: FieldProps) {
  return (
    <div
      className={
        'rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 data-[invalid=true]:border-rose-300 data-[invalid=true]:ring-2 data-[invalid=true]:ring-rose-100 ' +
        className
      }
      {...rest}
    >
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
      {children}
    </Label>
  );
}

export function FieldDescription({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-500">{children}</p>;
}

export function InputGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function InputGroupAddon({ children, align }: { children: ReactNode; align?: 'block-end' | 'center' }) {
  const alignment = align === 'block-end' ? 'items-end' : 'items-center';
  return (
    <div className={`flex ${alignment} bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600`}>{children}</div>
  );
}

export function InputGroupText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`text-xs whitespace-nowrap text-slate-500 ${className}`}>{children}</span>;
}
