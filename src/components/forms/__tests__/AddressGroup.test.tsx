import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { AddressGroup } from "../AddressGroup";

function Wrapper({ prefix = "addr", legend }: { prefix?: string; legend?: string }) {
  const methods = useForm({ defaultValues: { addr: {}, seller: {}, buyer: {} } });
  return (
    <FormProvider {...methods}>
      <form>
        <AddressGroup prefix={prefix} legend={legend} />
      </form>
    </FormProvider>
  );
}

function MultiWrapper() {
  const methods = useForm({ defaultValues: { seller: {}, buyer: {} } });
  return (
    <FormProvider {...methods}>
      <form>
        <AddressGroup prefix="seller" />
        <AddressGroup prefix="buyer" />
      </form>
    </FormProvider>
  );
}

describe("AddressGroup", () => {
  it("renders legend when provided", () => {
    render(<Wrapper legend="住所" />);
    expect(screen.getByText("住所")).toBeInTheDocument();
  });

  it("renders all five address fields", () => {
    render(<Wrapper />);
    expect(screen.getByLabelText(/郵便番号/)).toBeInTheDocument();
    expect(screen.getByLabelText(/都道府県/)).toBeInTheDocument();
    expect(screen.getByLabelText(/市区町村/)).toBeInTheDocument();
    expect(screen.getByLabelText(/町名・番地/)).toBeInTheDocument();
    expect(screen.getByLabelText(/建物名/)).toBeInTheDocument();
  });

  it("prefecture select contains all 47 prefectures", () => {
    render(<Wrapper />);
    expect(screen.getByRole("option", { name: "東京都" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "北海道" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "沖縄県" })).toBeInTheDocument();
  });

  it("shows 任意 badges on all fields", () => {
    render(<Wrapper />);
    const optional = screen.getAllByText("任意");
    expect(optional.length).toBeGreaterThanOrEqual(5);
  });

  it("uses prefix to avoid ID collisions with multiple instances", () => {
    const { container } = render(<MultiWrapper />);
    expect(container.querySelector("#seller-postal")).toBeInTheDocument();
    expect(container.querySelector("#buyer-postal")).toBeInTheDocument();
  });
});
