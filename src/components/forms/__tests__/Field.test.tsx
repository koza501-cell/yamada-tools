import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "../Field";

describe("Field", () => {
  it("renders label and input child", () => {
    render(
      <Field id="name" label="お名前" required>
        <input type="text" />
      </Field>
    );
    const label = screen.getByText("お名前", { exact: false }).closest("label");
    expect(label).toHaveAttribute("for", "name");
  });

  it("injects id onto child element", () => {
    render(
      <Field id="my-field" label="テスト" required>
        <input type="text" />
      </Field>
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "my-field");
  });

  it("shows error with role=alert and sets aria-invalid", () => {
    render(
      <Field id="err-field" label="エラー" error="入力してください">
        <input type="text" />
      </Field>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("入力してください");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows helper text when no error", () => {
    render(
      <Field id="h-field" label="ヘルパー" helper="ヒントです" optional>
        <input type="text" />
      </Field>
    );
    expect(screen.getByText("ヒントです")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("hides helper when error is present", () => {
    render(
      <Field id="he-field" label="テスト" helper="ヒント" error="エラー" optional>
        <input type="text" />
      </Field>
    );
    expect(screen.queryByText("ヒント")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("エラー");
  });
});
