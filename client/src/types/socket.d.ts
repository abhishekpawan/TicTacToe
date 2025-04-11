import { GameState } from "../contexts/GameContext";

export interface ServerToClientEvents {
  "match-found": (data: { roomId: string; players: { id: string; mark: "X" | "O" }[]; gameState: GameState }) => void;
  "waiting-for-opponent": () => void;
  "game-update": (gameState: GameState) => void;
  "game-over": (data: { winner: string | null; isDraw: boolean }) => void;
  "game-reset": (gameState: GameState) => void;
  "opponent-disconnected": () => void;
}

export interface ClientToServerEvents {
  "find-match": () => void;
  "make-move": (data: { roomId: string; position: number }) => void;
  "play-again": (data: { roomId: string }) => void;
} 