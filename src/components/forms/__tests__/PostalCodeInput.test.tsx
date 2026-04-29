import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PostalCodeInput } from "../PostalCodeInput";

afterEach(() => vi.restoreAllMocks());

describe("PostalCodeInput", () => {
  it("renders an input with placeholder 1234567", () => {
    render(<PostalCodeInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("1234567")).toBeInTheDocument();
  });

  it("calls onChange with hyphen stripped", () => {
    const onChange = vi.fn();
    render(<PostalCodeInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("1234567"), {
      target: { value: "123-4567" },
    });
    expect(onChange).toHaveBeenCalledWith("1234567");
  });

  it("calls onResolved with address on successful fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ address1: "東京都", address2: "渋谷区", address3: "道玄坂" }],
      }),
    }));
    const onResolved = vi.fn();
    render(<PostalCodeInput value="1500043" onChange={() => {}} onResolved={onResolved} />);
    fireEvent.blur(screen.getByPlaceholderText("1234567"));
    await waitFor(() =>
      expect(onResolved).toHaveBeenCalledWith({
        prefecture: "東京都", city: "渋谷区", town: "道玄坂",
      })
    );
  });

  it("shows hint text on network failure and form remains usable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    render(<PostalCodeInput value="9999999" onChange={() => {}} />);
    fireEvent.blur(screen.getByPlaceholderText("1234567"));
    await waitFor(() =>
      expect(screen.getByText("住所を取得できませんでした。手入力してください。")).toBeInTheDocument()
    );
    expect(screen.getByPlaceholderText("1234567")).toBeInTheDocument();
  });

  it("forwards aria-invalid and aria-describedby to the inner input", () => {
    render(
      <PostalCodeInput
        value=""
        onChange={() => {}}
        aria-invalid={true}
        aria-describedby="postal-error"
      />
    );
    const input = screen.getByPlaceholderText("1234567");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "postal-error");
  });
});
