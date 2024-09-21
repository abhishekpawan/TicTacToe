import { FC, ReactNode, createContext, useContext, useState } from "react";
import { IPlayerDetail } from "./customHooks/useGameBoard";

interface AppContextType {
  playerOneDetails: IPlayerDetail | undefined;
  setPlayerOneDetails: (state: IPlayerDetail) => void;
  playerTwoDetails: IPlayerDetail | undefined;
  setPlayerTwoDetails: (state: IPlayerDetail) => void;
  gameId: string;
  setGameId: (state: string) => void;
  ws: WebSocket | null;
  setWs: (state: WebSocket | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [playerOneDetails, setPlayerOneDetails] = useState<IPlayerDetail>({
    name: "Player 1",
    choice: "O",
  });
  const [playerTwoDetails, setPlayerTwoDetails] = useState<IPlayerDetail>();
  const [gameId, setGameId] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <AppContext.Provider
      value={{
        playerOneDetails,
        setPlayerOneDetails,
        playerTwoDetails,
        setPlayerTwoDetails,
        ws,
        setWs,
        gameId, setGameId,
      }}
    >
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
