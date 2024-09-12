import { FC, ReactNode, createContext, useContext, useState } from "react";

interface AppContextType {
  demo: boolean;
  setDemo: (state: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [demo, setDemo] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ demo, setDemo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAPp must be used within a AppProvider");
  }
  return context;
};
