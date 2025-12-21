import type { ChangeEvent, HTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "./components/ui";

// Lightweight UI primitives inspired by the provided example.
type FieldProps = HTMLAttributes<HTMLDivElement> & { "data-invalid"?: boolean };

function Field({ children, className = "", ...rest }: FieldProps) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 data-[invalid=true]:border-rose-300 data-[invalid=true]:ring-2 data-[invalid=true]:ring-rose-100 " +
        className
      }
      {...rest}
    >
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
      {children}
    </Label>
  );
}

function FieldDescription({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-500">{children}</p>;
}

function InputGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

function InputGroupAddon({
  children,
  align,
}: {
  children: ReactNode;
  align?: "block-end" | "center";
}) {
  const alignment = align === "block-end" ? "items-end" : "items-center";
  return (
    <div
      className={`flex ${alignment} bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600`}
    >
      {children}
    </div>
  );
}

function InputGroupText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`whitespace-nowrap text-xs text-slate-500 ${className}`}>
      {children}
    </span>
  );
}

type FormField = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "url";
  hint?: string;
};

const FORM_FIELDS: FormField[] = [
  { id: "input-naam", label: "Name", placeholder: "Final boss" },
  { id: "input-functie", label: "Role", placeholder: "Chiefest of chiefs" },
  { id: "input-gsm", label: "Phone", placeholder: "+32 470 01 23 45" },
  { id: "input-email", label: "Email", placeholder: "hello@upshift.be" },
  {
    id: "input-locatie-1",
    label: "Primary location",
    placeholder: "Antwerpen, België",
  },
  {
    id: "input-locatie-2",
    label: "Secondary location",
    placeholder: "Brussel, België",
    hint: "Optional, add a second office or department name",
  },
  {
    id: "input-facebook",
    label: "Facebook URL",
    placeholder: "https://www.facebook.com/upshiftbe",
    type: "url",
    hint: "Optional, add a public page so colleagues can follow you",
  },
  {
    id: "input-linkedin",
    label: "LinkedIn URL",
    placeholder: "https://www.linkedin.com/company/37812214/admin/dashboard/",
    type: "url",
    hint: "Optional, include the full URL for clickable links",
  },
  {
    id: "input-instagram",
    label: "Instagram URL",
    placeholder: "https://instagram.com/company",
    type: "url",
    hint: "Optional, a second handle for the social bar",
  },
  {
    id: "input-website",
    label: "Website URL",
    placeholder: "https://company.com",
    type: "url",
    hint: "Include https:// so recipients can tap the link",
  },
];

type FormGroup = {
  title: string;
  description: string;
  fieldIds: FormField["id"][];
};

const FORM_GROUPS: FormGroup[] = [
  {
    title: "Identity",
    description:
      "Capture the name and role that appear directly under your signature.",
    fieldIds: ["input-naam", "input-functie"],
  },
  {
    title: "Contact",
    description: "Phone, email and website links are clickable for recipients.",
    fieldIds: ["input-gsm", "input-email", "input-website"],
  },
  {
    title: "Location",
    description: "Add primary and optional secondary offices or departments.",
    fieldIds: ["input-locatie-1", "input-locatie-2"],
  },
  {
    title: "Social",
    description: "Optional public handles to share in your footer.",
    fieldIds: ["input-facebook", "input-linkedin", "input-instagram"],
  },
];

const FIELD_MAP: Record<FormField["id"], FormField> = FORM_FIELDS.reduce(
  (acc, field) => {
    acc[field.id] = field;
    return acc;
  },
  {} as Record<FormField["id"], FormField>
);

type FormState = Record<string, string>;
const STORAGE_KEY = "signatureBuilderState";
const PREFILL_VALUES: Record<FormField["id"], string> = {
  "input-facebook": "https://www.facebook.com/upshiftbe",
  "input-linkedin":
    "https://www.linkedin.com/company/37812214/admin/dashboard/",
};

function createDefaultState(): FormState {
  return FORM_FIELDS.reduce<FormState>(
    (state, field) => ({
      ...state,
      [field.id]: PREFILL_VALUES[field.id] ?? "",
    }),
    {} as FormState
  );
}

const DEFAULT_STATE: FormState = createDefaultState();

function readStoredState(): FormState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FormState) : {};
  } catch (error) {
    console.warn("Unable to read localStorage", error);
    return {};
  }
}

function persistState(state: FormState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Unable to persist localStorage", error);
  }
}

const RAW_ASSET_BASE =
  "https://raw.githubusercontent.com/upshiftbe/email-signature/refs/heads/main/src/assets";

function App() {
  const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const stored = readStoredState();
    const nextState = FORM_FIELDS.reduce<FormState>((acc, field) => {
      const fromParam = params.get(field.id);
      if (fromParam !== null) {
        return {
          ...acc,
          [field.id]: fromParam,
        };
      }

      if (stored[field.id]) {
        return {
          ...acc,
          [field.id]: stored[field.id],
        };
      }

      if (PREFILL_VALUES[field.id]) {
        return {
          ...acc,
          [field.id]: PREFILL_VALUES[field.id],
        };
      }

      return {
        ...acc,
        [field.id]: "",
      };
    }, {});

    setFormState(nextState);
    setHydrated(true);
  }, []);

  const resetForm = useCallback(() => {
    const defaultState = createDefaultState();
    setFormState(defaultState);

    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const updateUrlAndStorage = useCallback((state: FormState) => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();
    Object.entries(state).forEach(([key, value]) => {
      const trimmed = value.trim();
      if (trimmed) {
        params.set(key, trimmed);
      }
    });

    const query = params.toString();
    const nextUrl = window.location.pathname + (query ? `?${query}` : "");
    window.history.replaceState(null, "", nextUrl);
    persistState(state);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    updateUrlAndStorage(formState);
  }, [formState, hydrated, updateUrlAndStorage]);

  const trimmedValues = useMemo(() => {
    const getValue = (key: string) => (formState[key] || "").trim();
    const websiteUrl = getValue("input-website");
    return {
      name: getValue("input-naam"),
      role: getValue("input-functie"),
      phone: getValue("input-gsm"),
      email: getValue("input-email"),
      location1: getValue("input-locatie-1"),
      location2: getValue("input-locatie-2"),
      websiteUrl,
      websiteLabel: websiteUrl ? websiteUrl.replace(/^https?:\/\//, "") : "",
      facebook: getValue("input-facebook"),
      linkedin: getValue("input-linkedin"),
      instagram: getValue("input-instagram"),
    };
  }, [formState]);

  const handleFieldChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));
    },
    []
  );

  const copySignature = useCallback(async () => {
    const preview = previewRef.current;
    if (!preview) {
      return;
    }

    const htmlPayload = preview.outerHTML;
    const plainPayload = preview.innerText || "";

    if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlPayload], { type: "text/html" }),
            "text/plain": new Blob([plainPayload], { type: "text/plain" }),
          }),
        ]);
        return;
      } catch (error) {
        console.warn("navigator.clipboard.write failed", error);
      }
    }

    if (typeof document === "undefined") {
      return;
    }

    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    tempContainer.innerHTML = htmlPayload;
    document.body.appendChild(tempContainer);

    const range = document.createRange();
    range.selectNodeContents(tempContainer);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand("copy");
    } catch (error) {
      console.warn("Copy command failed", error);
    }

    selection?.removeAllRanges();
    document.body.removeChild(tempContainer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-emerald-200/50 backdrop-blur">
          <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-400/50">
              <span>U</span>
            </div>
            <span className="uppercase tracking-[0.28em] text-xs text-emerald-700">
              Upshift
            </span>
            <span className="mx-2 h-4 w-px bg-slate-200" aria-hidden />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                Email signature builder
              </h1>
              <p className="max-w-3xl text-base text-slate-600">
                Fill in the left column and preview your live email signature on
                the right. Everything stays synced with the URL for easy
                sharing.
              </p>
            </div>
          </div>
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-6">
            <Card className="bg-white/90 border border-slate-200 text-slate-900 shadow-2xl shadow-slate-900/5">
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-slate-900">
                      Signature details
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Only the filled fields are copied into the final HTML
                      snippet.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    className="h-10 border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 shadow-sm shadow-rose-200 hover:border-rose-300 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500/70 cursor-pointer"
                    onClick={resetForm}
                  >
                    Reset form
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-6 pt-1">
                <form className="space-y-6" autoComplete="off">
                  {FORM_GROUPS.map((group) => (
                    <fieldset
                      key={group.title}
                      className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-5 shadow-inner"
                    >
                      <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {group.title}
                      </legend>
                      <p className="text-sm text-slate-500">
                        {group.description}
                      </p>
                      <FieldGroup>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {group.fieldIds.map((fieldId) => {
                            const field = FIELD_MAP[fieldId];
                            if (!field) return null;
                            const isWide =
                              field.id.startsWith("input-locatie") ||
                              field.id === "input-website";
                            const isWebsite = field.id === "input-website";
                            const isPhone = field.id === "input-gsm";
                            const isEmail = field.id === "input-email";
                            return (
                              <Field
                                key={field.id}
                                className={isWide ? "sm:col-span-2" : ""}
                              >
                                <FieldLabel htmlFor={field.id}>
                                  {field.label}
                                </FieldLabel>
                                {isWebsite || isPhone || isEmail ? (
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <InputGroupText>
                                        {isWebsite
                                          ? "https://"
                                          : isPhone
                                          ? "+"
                                          : "@"}
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <div className="flex-1">
                                      <Input
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        type={field.type ?? "text"}
                                        value={formState[field.id] ?? ""}
                                        onChange={handleFieldChange(field.id)}
                                        className="h-11 border-0 bg-transparent px-3 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-0 focus:ring-0"
                                      />
                                    </div>
                                  </InputGroup>
                                ) : (
                                  <Input
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    type={field.type ?? "text"}
                                    value={formState[field.id] ?? ""}
                                    onChange={handleFieldChange(field.id)}
                                    className="h-11 border-0 bg-transparent px-0 text-slate-900 placeholder:text-slate-400 shadow-none focus:border-0 focus:ring-0"
                                  />
                                )}
                                {field.hint && (
                                  <FieldDescription>
                                    {field.hint}
                                  </FieldDescription>
                                )}
                              </Field>
                            );
                          })}
                        </div>
                      </FieldGroup>
                    </fieldset>
                  ))}
                </form>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-6">
            <Card className="bg-slate-900 text-white shadow-2xl shadow-slate-900/40 lg:sticky lg:top-10">
              <CardContent className="space-y-5 px-6 pb-6 pt-1">
                <div className="flex items-center gap-2 rounded-3xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full bg-rose-500"
                    aria-hidden
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-amber-300/90"
                    aria-hidden
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400/90"
                    aria-hidden
                  />
                  <span className="ml-auto text-[10px] uppercase tracking-[0.4em] text-slate-400">
                    Preview
                  </span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-4 py-3 text-sm text-slate-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                        Email preview
                      </span>
                      <span className="font-semibold text-slate-900">
                        New message
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 border-b border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-right text-[11px] font-semibold text-slate-500">
                        From
                      </span>
                      <div className="flex w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                        <span>hello@upshift.be</span>
                        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Your info
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-right text-[11px] font-semibold text-slate-500">
                        To
                      </span>
                      <div className="flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700">
                        <span>recipient@example.com</span>
                        <span className="ml-auto text-[11px] text-slate-400">
                          Cc
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-right text-[11px] font-semibold text-slate-500">
                        Subject
                      </span>
                      <div className="flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700">
                        <span>Sharing my updated signature</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        padding: 24,
                        fontFamily: "Segoe UI, sans-serif",
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "#181127",
                        marginBottom: 12,
                      }}
                    >
                      <p style={{ margin: 0 }}>Hi there,</p>
                      <p style={{ margin: 0 }}>
                        Here's the latest signature block. It updates live as
                        you tweak the fields on the left.
                      </p>
                      <p style={{ margin: 0 }}>Thanks!</p>
                    </div>
                    <div
                      ref={previewRef}
                      style={{
                        backgroundColor: "#ffffff",
                        padding: 24,
                        fontFamily: "Segoe UI, sans-serif",
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "#181127",
                      }}
                    >
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          width: "100%",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td>
                              <table
                                cellPadding={0}
                                cellSpacing={0}
                                style={{ width: "100%" }}
                              >
                                <tbody>
                                  <tr>
                                    <td style={{ verticalAlign: "middle" }}>
                                      <h3
                                        style={{
                                          margin: 0,
                                          fontSize: 17,
                                          fontWeight: 500,
                                          color: "#181127",
                                        }}
                                      >
                                        <span id="footer-naam">
                                          {trimmedValues.name}
                                        </span>
                                      </h3>
                                      <p
                                        style={{
                                          margin: 0,
                                          fontSize: 12,
                                          lineHeight: "22px",
                                          color: "#181127",
                                        }}
                                      >
                                        <span id="footer-functie">
                                          {trimmedValues.role}
                                        </span>
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        verticalAlign: "middle",
                                        borderLeft: "1px solid #283e89",
                                        paddingLeft: 16,
                                      }}
                                    >
                                      <table
                                        cellPadding={0}
                                        cellSpacing={0}
                                        style={{ width: "100%" }}
                                      >
                                        <tbody>
                                          <tr
                                            style={{
                                              verticalAlign: "middle",
                                              height: 25,
                                            }}
                                          >
                                            <td
                                              width={30}
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <img
                                                src={`${RAW_ASSET_BASE}/phone.png`}
                                                width={20}
                                                height={20}
                                                alt="Phone"
                                                style={{ display: "block" }}
                                              />
                                            </td>
                                            <td
                                              style={{
                                                verticalAlign: "middle",
                                                fontSize: 12,
                                              }}
                                            >
                                              <a
                                                id="link-gsm"
                                                href={
                                                  trimmedValues.phone
                                                    ? `tel:${trimmedValues.phone}`
                                                    : ""
                                                }
                                                style={{
                                                  textDecoration: "none",
                                                  color: "#181127",
                                                }}
                                              >
                                                <span id="footer-gsm">
                                                  {trimmedValues.phone}
                                                </span>
                                              </a>
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              verticalAlign: "middle",
                                              height: 25,
                                            }}
                                          >
                                            <td
                                              width={30}
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <img
                                                src={`${RAW_ASSET_BASE}/mail.png`}
                                                width={20}
                                                height={20}
                                                alt="Email"
                                                style={{ display: "block" }}
                                              />
                                            </td>
                                            <td
                                              style={{
                                                verticalAlign: "middle",
                                                fontSize: 12,
                                              }}
                                            >
                                              <a
                                                id="link-email"
                                                href={
                                                  trimmedValues.email
                                                    ? `mailto:${trimmedValues.email}`
                                                    : ""
                                                }
                                                style={{
                                                  textDecoration: "none",
                                                  color: "#181127",
                                                }}
                                              >
                                                <span id="footer-email">
                                                  {trimmedValues.email}
                                                </span>
                                              </a>
                                            </td>
                                          </tr>
                                          {trimmedValues.websiteUrl && (
                                            <tr
                                              style={{
                                                verticalAlign: "middle",
                                                height: 25,
                                              }}
                                            >
                                              <td
                                                width={30}
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                              >
                                                <img
                                                  src={`${RAW_ASSET_BASE}/globe.png`}
                                                  width={20}
                                                  height={20}
                                                  alt="Website"
                                                  style={{ display: "block" }}
                                                />
                                              </td>
                                              <td
                                                style={{
                                                  verticalAlign: "middle",
                                                  fontSize: 12,
                                                }}
                                              >
                                                <a
                                                  id="link-website"
                                                  href={
                                                    trimmedValues.websiteUrl
                                                  }
                                                  style={{
                                                    textDecoration: "none",
                                                    color: "#181127",
                                                  }}
                                                >
                                                  <span id="footer-website">
                                                    {trimmedValues.websiteLabel ||
                                                      trimmedValues.websiteUrl}
                                                  </span>
                                                </a>
                                              </td>
                                            </tr>
                                          )}
                                          <tr
                                            style={{
                                              verticalAlign: "middle",
                                              height: 25,
                                            }}
                                          >
                                            <td
                                              width={30}
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <img
                                                src={`${RAW_ASSET_BASE}/building.png`}
                                                width={20}
                                                height={20}
                                                alt="Location"
                                                style={{ display: "block" }}
                                              />
                                            </td>
                                            <td
                                              style={{
                                                verticalAlign: "middle",
                                                fontSize: 12,
                                              }}
                                            >
                                              <span id="footer-locatie-1">
                                                {trimmedValues.location1}
                                              </span>
                                            </td>
                                          </tr>
                                          {trimmedValues.location2 && (
                                            <tr
                                              id="footer-locatie-2-container"
                                              style={{
                                                verticalAlign: "middle",
                                                height: 25,
                                              }}
                                            >
                                              <td
                                                width={30}
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                              />
                                              <td
                                                style={{
                                                  verticalAlign: "middle",
                                                  fontSize: 12,
                                                }}
                                              >
                                                <span id="footer-locatie-2">
                                                  {trimmedValues.location2}
                                                </span>
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                cellPadding={0}
                                cellSpacing={0}
                                style={{ width: "100%", marginTop: 5 }}
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <a
                                        href="https://upshift.be"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={`${RAW_ASSET_BASE}/upshift_logo.png`}
                                          width={100}
                                          alt="Upshift"
                                          style={{
                                            maxHeight: 50,
                                            width: "auto",
                                            display: "block",
                                          }}
                                        />
                                      </a>
                                    </td>
                                    <td
                                      style={{
                                        paddingBottom: 2,
                                        textAlign: "right",
                                      }}
                                    >
                                      <table
                                        cellPadding={0}
                                        cellSpacing={0}
                                        style={{
                                          marginLeft: "auto",
                                          display: "inline-flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <tbody>
                                          <tr>
                                            {[
                                              {
                                                id: "facebook",
                                                icon: "facebook.png",
                                                href: trimmedValues.facebook,
                                              },
                                              {
                                                id: "linkedin",
                                                icon: "linkedin.png",
                                                href: trimmedValues.linkedin,
                                              },
                                              {
                                                id: "instagram",
                                                icon: "instagram.png",
                                                href: trimmedValues.instagram,
                                              },
                                            ].map((social) =>
                                              social.href ? (
                                                <td key={social.id}>
                                                  <a
                                                    id={`link-${social.id}`}
                                                    href={social.href}
                                                    style={{
                                                      display: "inline-block",
                                                      padding: 0,
                                                      color: "#181127",
                                                    }}
                                                  >
                                                    <img
                                                      src={`${RAW_ASSET_BASE}/${social.icon}`}
                                                      width={20}
                                                      height={20}
                                                      alt={social.id}
                                                      style={{
                                                        display: "block",
                                                      }}
                                                    />
                                                  </a>
                                                </td>
                                              ) : null
                                            )}
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                cellPadding={0}
                                cellSpacing={0}
                                style={{ width: "100%" }}
                              >
                                <tbody>
                                  <tr>
                                    <td height={5} />
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        width: "100%",
                                        borderBottom: "1px solid #283e89",
                                        display: "block",
                                      }}
                                    />
                                  </tr>
                                  <tr>
                                    <td height={5} />
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button
                  type="button"
                  className="w-full border border-slate-700 bg-transparent text-slate-200 hover:border-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70"
                  onClick={resetForm}
                >
                  Reset form
                </Button>
                <Button
                  type="button"
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70 cursor-pointer"
                  onClick={copySignature}
                >
                  Copy signature
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
