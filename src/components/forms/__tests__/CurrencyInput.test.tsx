import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyInput } from "../CurrencyInput";

describe("CurrencyInput", () => {
  it("renders empty string when value is empty", () => {
    render(<CurrencyInput value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows formatted value with 円 suffix when not focused", () => {
    render(<CurrencyInput value={1234567} onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("1,234,567 円");
  });

  it("shows raw number on focus", () => {
    render(<CurrencyInput value={1234567} onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(input).toHaveValue("1234567");
  });

  it("calls onChange with parsed number on input", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "50000" } });
    expect(onChange).toHaveBeenCalledWith(50000);
  });

  it("calls onChange with empty string when cleared", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={100} onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("strips non-numeric characters on input", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1,234円" } });
    expect(onChange).toHaveBeenCalledWith(1234);
  });
});
