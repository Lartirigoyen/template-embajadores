'use client';

import { useState } from "react";
import Input, { type InputProps } from "./Input";

type InputNumberProps = Omit<InputProps, "type" | "value" | "onChange"> & {
  decimals?: number;
};

export const InputNumber = ({ decimals, ...props }: InputNumberProps) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;

    // 1) dejar solo dígitos y coma
    v = v.replace(/[^\d,]/g, "");

    // 2) permitir una sola coma (si hay más, las borra)
    const firstComma = v.indexOf(",");
    if (firstComma !== -1) {
      v =
        v.slice(0, firstComma + 1) +
        v.slice(firstComma + 1).replace(/,/g, "");
    }

    // 3) separar entero/decimal
    const [intPartRaw, decRaw = ""] = v.split(",");

    // 4) formatear miles en entero
    const intFormatted = intPartRaw
      .replace(/^0+(?=\d)/, "") // opcional: quita ceros a la izquierda (deja "0" si es solo 0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // 5) limitar decimales
    const decPart = decRaw.slice(0, decimals);

    // 6) reconstruir (si el user escribió coma, la mantenemos aunque no haya decimales todavía)
    const hasComma = firstComma !== -1;
    const formatted = hasComma ? `${intFormatted || "0"},${decPart}` : (intFormatted || "");

    setValue(formatted);
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
    />
  );
}

export default InputNumber;