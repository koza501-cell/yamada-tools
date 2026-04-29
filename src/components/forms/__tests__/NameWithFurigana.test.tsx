import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NameWithFurigana } from "../NameWithFurigana";

describe("NameWithFurigana", () => {
  it("renders name and furigana inputs", () => {
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue=""
        onNameChange={() => {}}
        onFuriganaChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/フリガナ/)).toBeInTheDocument();
  });

  it("shows 必須 pill on name field when required=true", () => {
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue=""
        onNameChange={() => {}}
        onFuriganaChange={() => {}}
        required
      />
    );
    expect(screen.getByText("必須")).toBeInTheDocument();
  });

  it("furigana field shows 任意 pill", () => {
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue=""
        onNameChange={() => {}}
        onFuriganaChange={() => {}}
      />
    );
    expect(screen.getByText("任意")).toBeInTheDocument();
  });

  it("auto-fills furigana (hiragana→katakana) when composition is kana-only and furigana empty", () => {
    const onFuriganaChange = vi.fn();
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue=""
        onNameChange={() => {}}
        onFuriganaChange={onFuriganaChange}
      />
    );
    fireEvent.compositionEnd(screen.getByLabelText(/氏名/), { data: "やまだ" });
    expect(onFuriganaChange).toHaveBeenCalledWith("ヤマダ");
  });

  it("does NOT auto-fill when composition contains kanji", () => {
    const onFuriganaChange = vi.fn();
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue=""
        onNameChange={() => {}}
        onFuriganaChange={onFuriganaChange}
      />
    );
    fireEvent.compositionEnd(screen.getByLabelText(/氏名/), { data: "山田" });
    expect(onFuriganaChange).not.toHaveBeenCalled();
  });

  it("does NOT overwrite existing furigana value", () => {
    const onFuriganaChange = vi.fn();
    render(
      <NameWithFurigana
        id="test"
        nameValue=""
        furiganaValue="ヤマダ"
        onNameChange={() => {}}
        onFuriganaChange={onFuriganaChange}
      />
    );
    fireEvent.compositionEnd(screen.getByLabelText(/氏名/), { data: "たろう" });
    expect(onFuriganaChange).not.toHaveBeenCalled();
  });
});
