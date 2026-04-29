import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormLabel } from "../FormLabel";

describe("FormLabel", () => {
  it("renders label text with htmlFor", () => {
    render(<FormLabel htmlFor="test-id">お名前</FormLabel>);
    const label = screen.getByText("お名前").closest("label");
    expect(label).toHaveAttribute("for", "test-id");
  });

  it("shows 必須 pill when required=true", () => {
    render(<FormLabel htmlFor="x" required>フィールド</FormLabel>);
    expect(screen.getByText("必須")).toBeInTheDocument();
    expect(screen.queryByText("任意")).not.toBeInTheDocument();
  });

  it("shows 任意 pill when optional=true", () => {
    render(<FormLabel htmlFor="x" optional>フィールド</FormLabel>);
    expect(screen.getByText("任意")).toBeInTheDocument();
    expect(screen.queryByText("必須")).not.toBeInTheDocument();
  });

  it("required takes precedence when both flags true", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<FormLabel htmlFor="x" required optional>フィールド</FormLabel>);
    expect(screen.getByText("必須")).toBeInTheDocument();
    expect(screen.queryByText("任意")).not.toBeInTheDocument();
    warnSpy.mockRestore();
  });

  it("emits console.warn in dev when both flags true", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<FormLabel htmlFor="x" required optional>x</FormLabel>);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("required"));
    warnSpy.mockRestore();
  });

  it("shows no pill when neither required nor optional", () => {
    render(<FormLabel htmlFor="x">フィールド</FormLabel>);
    expect(screen.queryByText("必須")).not.toBeInTheDocument();
    expect(screen.queryByText("任意")).not.toBeInTheDocument();
  });
});
