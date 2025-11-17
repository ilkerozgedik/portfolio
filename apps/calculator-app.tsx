import type React from "react";
import { useState } from "react";
import {
  executeOperation,
  formatDisplay,
  type OperationSymbol,
} from "../lib/calculator";

const Button = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => (
  <button
    className={`flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl border border-border/40 bg-card text-card-foreground text-lg shadow-sm transition-colors hover:bg-muted/60 ${className}`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<OperationSymbol | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const inputDigit = (digit: number) => {
    if (errorMessage) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      setErrorMessage(null);
      return;
    }
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      return;
    }
    setDisplay(display === "0" ? String(digit) : display + digit);
  };

  const inputDecimal = () => {
    if (errorMessage) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setErrorMessage(null);
      return;
    }
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(`${display}.`);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setErrorMessage(null);
  };

  const commitError = (message: string) => {
    setErrorMessage(message);
    setDisplay("Error");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: OperationSymbol) => {
    if (errorMessage) {
      return;
    }
    const inputValue = Number.parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const { value, error } = executeOperation(
        previousValue ?? 0,
        inputValue,
        operation
      );
      if (error) {
        commitError(error);
        return;
      }
      setDisplay(formatDisplay(value));
      setPreviousValue(value);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    if (errorMessage) {
      return;
    }
    const inputValue = Number.parseFloat(display);

    if (previousValue !== null && operation) {
      const { value, error } = executeOperation(
        previousValue,
        inputValue,
        operation
      );
      if (error || value === null) {
        commitError(error ?? "Geçersiz işlem");
        return;
      }
      setDisplay(formatDisplay(value));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-card/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 rounded-2xl border border-border/40 bg-muted/20 p-4 shadow-black/10 shadow-inner">
        <div className="text-right font-mono text-3xl text-foreground sm:text-4xl">
          {display}
        </div>
        {errorMessage && (
          <p className="mt-2 text-right text-destructive text-xs">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-3">
        <Button
          className="col-span-2 bg-destructive/10 text-destructive hover:bg-destructive/20"
          onClick={clear}
        >
          C
        </Button>
        <Button
          className="bg-primary/10 text-primary hover:bg-primary/20"
          onClick={() => performOperation("/")}
        >
          ÷
        </Button>
        <Button
          className="bg-primary/10 text-primary hover:bg-primary/20"
          onClick={() => performOperation("*")}
        >
          ×
        </Button>
        <Button onClick={() => inputDigit(7)}>7</Button>
        <Button onClick={() => inputDigit(8)}>8</Button>
        <Button onClick={() => inputDigit(9)}>9</Button>
        <Button
          className="bg-primary/10 text-primary hover:bg-primary/20"
          onClick={() => performOperation("-")}
        >
          −
        </Button>
        <Button onClick={() => inputDigit(4)}>4</Button>
        <Button onClick={() => inputDigit(5)}>5</Button>
        <Button onClick={() => inputDigit(6)}>6</Button>
        <Button
          className="bg-primary/10 text-primary hover:bg-primary/20"
          onClick={() => performOperation("+")}
        >
          +
        </Button>
        <Button onClick={() => inputDigit(1)}>1</Button>
        <Button onClick={() => inputDigit(2)}>2</Button>
        <Button onClick={() => inputDigit(3)}>3</Button>
        <Button
          className="row-span-2 bg-primary text-primary-foreground hover:bg-primary/80"
          onClick={handleEquals}
        >
          =
        </Button>
        <Button className="col-span-2" onClick={() => inputDigit(0)}>
          0
        </Button>
        <Button onClick={inputDecimal}>.</Button>
      </div>
    </div>
  );
};

export default CalculatorApp;
