import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JPDateInput } from "../JPDateInput";

describe("JPDateInput", () => {
  it("shows 日付を選択 when value is empty", () => {
    render(<JPDateInput value="" onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("日付を選択");
  });

  it("displays formatted date in seireki when value is set", () => {
    render(<JPDateInput value="2024-04-01" onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("2024年4月1日");
  });

  it("opens popover with year/month/day selects on click", () => {
    render(<JPDateInput value="2024-04-01" onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3);
  });

  it("calls onChange with ISO string on 確定", () => {
    const onChange = vi.fn();
    render(<JPDateInput value="2024-04-01" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /2024年4月1日/ }));
    fireEvent.click(screen.getByText("確定"));
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  });

  it("forwards aria-invalid and aria-describedby to trigger button", () => {
    render(
      <JPDateInput
        value=""
        onChange={() => {}}
        aria-invalid={true}
        aria-describedby="date-error"
      />
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-invalid", "true");
    expect(btn).toHaveAttribute("aria-describedby", "date-error");
  });

  it("shows era toggle buttons (西暦/令和/平成/昭和) when popover opens", () => {
    render(<JPDateInput value="2024-04-01" onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /2024年4月1日/ }));
    expect(screen.getByText("西暦")).toBeInTheDocument();
    expect(screen.getByText("令和")).toBeInTheDocument();
    expect(screen.getByText("平成")).toBeInTheDocument();
    expect(screen.getByText("昭和")).toBeInTheDocument();
  });
});
