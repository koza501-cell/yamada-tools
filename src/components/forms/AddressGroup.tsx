"use client";
import { useFormContext, Controller } from "react-hook-form";
import { Field } from "./Field";
import { PostalCodeInput, type PostalResult } from "./PostalCodeInput";

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

interface AddressGroupProps {
  /** Field name prefix (e.g. "seller" → registers seller.postalCode, seller.prefecture …) */
  prefix: string;
  legend?: string;
}

function getNestedError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>,
  path: string
): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const val = path.split(".").reduce<any>((obj, key) => obj?.[key], errors);
  return val?.message as string | undefined;
}

export function AddressGroup({ prefix, legend }: AddressGroupProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  function handleResolved(r: PostalResult) {
    setValue(`${prefix}.prefecture`, r.prefecture, { shouldValidate: true });
    setValue(`${prefix}.city`, r.city, { shouldValidate: true });
    setValue(`${prefix}.town`, r.town, { shouldValidate: true });
  }

  const e = (field: string) => getNestedError(errors, `${prefix}.${field}`);

  return (
    <fieldset className="space-y-3">
      {legend && (
        <legend className="font-bold text-gray-800 mb-2">{legend}</legend>
      )}

      <Controller
        control={control}
        name={`${prefix}.postalCode`}
        defaultValue=""
        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
          <Field id={`${prefix}-postal`} label="郵便番号" optional error={error?.message}>
            <PostalCodeInput
              ref={ref}
              value={value as string}
              onChange={onChange}
              onResolved={handleResolved}
            />
          </Field>
        )}
      />

      <Field id={`${prefix}-pref`} label="都道府県" optional error={e("prefecture")}>
        <select
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...register(`${prefix}.prefecture`)}
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field id={`${prefix}-city`} label="市区町村" optional error={e("city")}>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...register(`${prefix}.city`)}
        />
      </Field>

      <Field id={`${prefix}-street`} label="町名・番地" optional error={e("street")}>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...register(`${prefix}.street`)}
        />
      </Field>

      <Field id={`${prefix}-building`} label="建物名" optional error={e("building")}>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          {...register(`${prefix}.building`)}
        />
      </Field>
    </fieldset>
  );
}
