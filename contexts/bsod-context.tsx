import { createContext, type ReactNode, useContext, useState } from "react";

type BSODContextType = {
  isBSODVisible: boolean;
  showBSOD: () => void;
  hideBSOD: () => void;
};

const BSODContext = createContext<BSODContextType | undefined>(undefined);

export const BSODProvider = ({ children }: { children: ReactNode }) => {
  const [isBSODVisible, setIsBSODVisible] = useState(false);

  const showBSOD = () => setIsBSODVisible(true);
  const hideBSOD = () => setIsBSODVisible(false);

  return (
    <BSODContext.Provider
      value={{
        isBSODVisible,
        showBSOD,
        hideBSOD,
      }}
    >
      {children}
    </BSODContext.Provider>
  );
};

export const useBSOD = (): BSODContextType => {
  const context = useContext(BSODContext);
  if (!context) {
    throw new Error("useBSOD must be used within a BSODProvider");
  }
  return context;
};
