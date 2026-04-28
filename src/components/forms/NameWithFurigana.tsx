"use client";
import { type InputHTMLAttributes } from "react";
import { Field } from "./Field";

// Matches strings exclusively composed of hiragana, katakana, long-vowel mark, or whitespace
// Never attempts kanji-to-kana conversion
const KANA_ONLY_RE = /^[\u3041-\u3096\u30A1-\u30F6\u30FC\s\u3000]+$/;

export interface NameWithFuriganaProps {
  /** id prefix — name gets `${id}-name`, furigana gets `${id}-furigana` */
  id: string;
  nameValue: string;
  furiganaValue: string;
  onNameChange: (v: string) => void;
  onFuriganaChange: (v: string) => void;
  nameLabel?: string;
  furiganaLabel?: string;
  required?: boolean;
  nameError?: string;
  furiganaError?: string;
  nameInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;
  furiganaInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;
}

export function NameWithFurigana({
  id,
  nameValue,
  furiganaValue,
  onNameChange,
  onFuriganaChange,
  nameLabel = "氏名・会社名",
  furiganaLabel = "フリガナ",
  required,
  nameError,
  furiganaError,
  nameInputProps,
  furiganaInputProps,
}: NameWithFuriganaProps) {
  function handleCompositionEnd(e: React.CompositionEvent<HTMLInputElement>) {
    const composed = e.data ?? "";
    // Auto-fill furigana only when composed text is kana-only and furigana field is empty
    if (composed && KANA_ONLY_RE.test(composed) && !furiganaValue) {
      // Convert hiragana to katakana (standard furigana convention)
      const katakana = composed.replace(/[\u3041-\u3096]/g, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 0x60)
      );
      onFuriganaChange(katakana);
    }
  }

  return (
    <div className="space-y-3">
      <Field
        id={`${id}-name`}
        label={nameLabel}
        required={required}
        error={nameError}
      >
        <input
          type="text"
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          onCompositionEnd={handleCompositionEnd}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...nameInputProps}
        />
      </Field>
      <Field
        id={`${id}-furigana`}
        label={furiganaLabel}
        optional
        error={furiganaError}
        helper="カタカナで入力してください"
      >
        <input
          type="text"
          value={furiganaValue}
          onChange={(e) => onFuriganaChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...furiganaInputProps}
        />
      </Field>
    </div>
  );
}
