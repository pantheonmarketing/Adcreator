"use client";

import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import HintTooltip from "@/components/ui/tooltips/HintTooltip";
import { Input } from "../input";
import { Textarea } from "../textarea";

export interface RefInputText {
  input: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
  textArea: RefObject<HTMLTextAreaElement>;
}

type EditorSize = "sm" | "md" | "lg" | "auto" | "full" | "screen";

type WithDefaultValue = { defaultValue: string | undefined };
type WithValueAndSetValue = { value: string | undefined; setValue: React.Dispatch<React.SetStateAction<string>> };

export type InputTextProps = (WithDefaultValue | WithValueAndSetValue) & {
  id?: string;
  name?: string;
  title?: string;
  withLabel?: boolean;
  className?: string;
  classNameBg?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  withTranslation?: boolean;
  translationParams?: string[];
  placeholder?: string;
  pattern?: string;
  rows?: number;
  button?: ReactNode;
  type?: string;
  darkMode?: boolean;
  hint?: ReactNode;
  help?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  hideChars?: boolean;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};
const InputText = (props: InputTextProps, ref: Ref<RefInputText>) => {
  const {
    id,
    name,
    title,
    withLabel = true,
    className,
    classNameBg,
    help,
    disabled = false,
    readOnly = false,
    required = false,
    minLength,
    maxLength,
    autoComplete,
    withTranslation = false,
    translationParams = [],
    placeholder,
    pattern,
    hint,
    rows,
    button,
    type = "text",
    darkMode,
    onBlur,
    onFocus,
    autoFocus,
    hideChars,
    onPaste,
  } = props;

  const { t, i18n } = useTranslation();

  const value = "value" in props ? props.value : undefined;
  const setValue = "setValue" in props ? props.setValue : undefined;
  const defaultValue = "defaultValue" in props ? props.defaultValue : undefined;

  useImperativeHandle(ref, () => ({ input, textArea }));
  const input = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const [actualValue, setActualValue] = useState<string>(value ?? defaultValue ?? "");

  useEffect(() => {
    setActualValue(value || defaultValue || "");
  }, [value, defaultValue]);

  useEffect(() => {
    if (setValue && actualValue !== value) {
      setValue(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  function getTranslation(value: string) {
    if (!i18n.exists(value)) {
      return null;
    }
    return t(value);
  }

  function onChange(value: string) {
    setActualValue(value);
    if (setValue) {
      setValue(value);
      // if (lowercase) {
      //   setValue(value.toLowerCase());
      // } else if (uppercase) {
      //   setValue(value.toUpperCase());
      // } else {
      //   setValue(value);
      // }
    }
  }

  return (
    <div className={clsx(className, !darkMode && "")}>
      {withLabel && title && (
        <label htmlFor={name} className="mb-1 flex justify-between space-x-2 truncate text-xs font-medium">
          <div className="flex flex-shrink-0 items-center space-x-1 truncate">
            <div className="flex space-x-1 truncate">
              <div className="truncate">{title}</div>
              {required && title && <div className="ml-1 text-red-500">*</div>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {withTranslation && value?.includes(".") && (
            <div className="truncate font-light italic text-slate-600" title={t(value, { 0: translationParams })}>
              {t("admin.pricing.i18n")}:{" "}
              {getTranslation(value) ? (
                <span className="text-slate-600">{t(value, { 0: translationParams })}</span>
              ) : (
                <span className="text-red-600">{t("shared.invalid")}</span>
              )}
            </div>
          )}
          {hint}
        </label>
      )}
      <div className={clsx("relative flex w-full rounded-md")}>
        {!rows ? (
          <>
            <Input
              ref={input}
              type={type}
              style={hideChars ? ({ WebkitTextSecurity: "disc" } as any) : {}}
              id={id ?? name}
              name={name}
              autoComplete={autoComplete}
              required={required}
              minLength={minLength}
              maxLength={maxLength}
              defaultValue={defaultValue}
              value={value}
              onChange={(e) => onChange(e.currentTarget.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              pattern={pattern !== "" && pattern !== undefined ? pattern : undefined}
              autoFocus={autoFocus}
              className={clsx(className)}
              onPaste={onPaste}
            />
            {button}
          </>
        ) : (
          <Textarea
            rows={rows}
            ref={textArea}
            style={hideChars ? ({ WebkitTextSecurity: "disc" } as any) : {}}
            id={id ?? name}
            name={name}
            autoComplete={autoComplete}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            autoFocus={autoFocus}
          />
        )}
      </div>
    </div>
  );
};

// function ChangeEditorSize({ value, onChange }: { value: string; onChange: (value: EditorSize) => void }) {
//   const sizes: EditorSize[] = ["sm", "md", "lg", "auto", "screen"];
//   return (
//     <div className="flex items-center space-x-1">
//       {sizes.map((size, idx) => {
//         return (
//           <Fragment key={idx}>
//             <button type="button" onClick={() => onChange(size)} className="text-xs text-gray-600 hover:underline">
//               <div className={clsx(value === size ? "font-bold" : "")}>{size}</div>
//             </button>
//             {idx !== sizes.length - 1 && <div>•</div>}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }

export default forwardRef(InputText);
