export type OperationSymbol = "+" | "-" | "*" | "/" | "=";

export type CalculationResult =
  | { value: number; error?: undefined }
  | { value: null; error: string };

export const executeOperation = (
  firstValue: number,
  secondValue: number,
  operation: OperationSymbol
): CalculationResult => {
  switch (operation) {
    case "+":
      return { value: firstValue + secondValue };
    case "-":
      return { value: firstValue - secondValue };
    case "*":
      return { value: firstValue * secondValue };
    case "/":
      if (secondValue === 0) {
        return { value: null, error: "Sıfıra bölme yapılamaz" };
      }
      return { value: firstValue / secondValue };
    case "=":
      return { value: secondValue };
    default:
      return { value: secondValue };
  }
};

const TRAILING_ZERO_REGEX = /\.?0+$/;

export const formatDisplay = (value: number, precision = 8) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }
  const valueAsString = value.toString();
  const [, fractional = ""] = valueAsString.split(".");

  if (fractional.length > precision) {
    const fixed = value.toFixed(precision);
    return fixed.replace(TRAILING_ZERO_REGEX, "");
  }

  return valueAsString;
};
