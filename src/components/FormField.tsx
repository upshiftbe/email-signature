import type { ChangeEvent } from "react";
import type { FormField as FormFieldType } from "../types";
import { Input } from "./ui/input";
import {
  Field,
  FieldDescription,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "./ui/form";

type FormFieldProps = {
  field: FormFieldType;
  value: string;
  onChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void;
};

export function FormField({ field, value, onChange }: FormFieldProps) {
  const isWide =
    field.id.startsWith("input-locatie") || field.id === "input-website";
  const isWebsite = field.id === "input-website";
  const isPhone = field.id === "input-gsm";
  const isEmail = field.id === "input-email";

  return (
    <Field className={isWide ? "sm:col-span-2" : ""}>
      <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
      {isWebsite || isPhone || isEmail ? (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>
              {isWebsite ? "https://" : isPhone ? "+" : "@"}
            </InputGroupText>
          </InputGroupAddon>
          <div className="flex-1">
            <Input
              id={field.id}
              placeholder={field.placeholder}
              type={field.type ?? "text"}
              value={value}
              onChange={onChange(field.id)}
              className="h-11 border-0 bg-transparent px-3 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-0 focus:ring-0"
            />
          </div>
        </InputGroup>
      ) : (
        <Input
          id={field.id}
          placeholder={field.placeholder}
          type={field.type ?? "text"}
          value={value}
          onChange={onChange(field.id)}
          className="h-11 border-0 bg-transparent px-0 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-0 focus:ring-0"
        />
      )}
      {field.hint && <FieldDescription>{field.hint}</FieldDescription>}
    </Field>
  );
}

