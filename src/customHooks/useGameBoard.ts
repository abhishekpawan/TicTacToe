import { useEffect, useState } from "react";
import { GameBoardProps } from "../components/GameBoard";

const useGamBaord = ({ playerDetails, timer }: GameBoardProps) => {
  const playerOneDetails = playerDetails[0];
  const playerTwoDetails = playerDetails[1];
  const [gameResult, setGameResult] = useState({
    playerDetails: {
      name: "",
      choice: "",
    },
    isDraw: false,
    gameEnded: false,
  });
  const [gameState, setGameState] = useState([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);

  // Randomize the starting player by initializing with a random value (1 or 2)
  const [gridClickCounter, setGridClickCounter] = useState(
    () => Math.floor(Math.random() * 2) + 1
  );
  const [timerReset, setTimerReset] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timer);

  // handle player turn timer
  const handleTurnTimer = () => {
    if (timeLeft === 0) {
      setGridClickCounter((prev) => prev + 1);
      setTimerReset(true);
      setTimeLeft(timer);
      return;
    }
    const interval = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(interval);
  };

  // Check for a win in any row
  const checkHorizontalWin = (board: string[][]) => {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== "-" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return board[i][0];
      }
    }
    return null;
  };
  // Check for a win in any column
  const checkVerticalWin = (board: string[][]) => {
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== "-" &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return board[0][i];
      }
    }
    return null;
  };

  // Check for a win in either diagonal
  const checkDiagonalWin = (board: string[][]) => {
    if (
      board[0][0] !== "-" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] !== "-" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }
    return null;
  };

  // Check win conditions for all rows, columns, and diagonals
  const checkWinConditions = () => {
    const horizontalWin = checkHorizontalWin(gameState);
    const verticalWin = checkVerticalWin(gameState);
    const diagonalWin = checkDiagonalWin(gameState);

    const winner = horizontalWin || verticalWin || diagonalWin;

    if (winner) {
      setTimeout(() => {
        resetGame();
        setGameResult({
          playerDetails:
            winner === playerOneDetails.choice
              ? playerOneDetails
              : playerTwoDetails,
          isDraw: false,
          gameEnded: true,
        });
      }, 500);
      return true;
    }
    return false;
  };

  // Check draw by checking all cells are filled without a winner
  const checkDraw = () => {
    const isBoardFull = gameState.every((row) =>
      row.every((cell) => cell !== "-")
    );
    if (isBoardFull && !checkWinConditions()) {
      setTimeout(() => {
        resetGame();
        setGameResult({
          playerDetails: {
            name: "",
            choice: "",
          },
          isDraw: true,
          gameEnded: true,
        });
      }, 500);
    }
  };

  // Handle click on grid cells
  const handleGameGridClick = (i: number, j: number) => {
    if (gameState[i][j] !== "-") return;

    // Update game state and click counter
    if (!gameResult.gameEnded) {
      const newGameState = gameState.map((row, rowIndex) =>
        row.map((box, colIndex) =>
          rowIndex === i && colIndex === j
            ? gridClickCounter % 2 !== 0
              ? playerOneDetails.choice
              : playerTwoDetails.choice
            : box
        )
      );
      setGameState(newGameState);
      setGridClickCounter(gridClickCounter + 1);
      setTimerReset(true);
    }
  };

  // Handle game reset
  const resetGame = () => {
    setGameState([
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ]);
    // Randomize who gets the first turn again
    setGridClickCounter(Math.floor(Math.random() * 2) + 1);
    setGameResult({
      playerDetails: {
        name: "",
        choice: "",
      },
      isDraw: false,
      gameEnded: false,
    });
    setTimeLeft(timer);
    setTimerReset(true);
  };

  useEffect(() => {
    if (checkWinConditions()) return;
    checkDraw();
  }, [gridClickCounter]);

  useEffect(() => {
    if (timerReset) {
      setTimeLeft(timer);
      setTimerReset(false); // Reset the flag after resetting the timer
    }
    if (!gameResult.gameEnded) handleTurnTimer();
  }, [timeLeft, gameResult.gameEnded]);

  return {
    gridClickCounter,
    gameState,
    gameResult,
    timeLeft,
    handleGameGridClick,
    resetGame,
  };
};

export default useGamBaord;
