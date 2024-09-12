import { FC } from "react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import useGameBoard from "../customHooks/useGameBoard";
import PlayerTurnPopup from "./PlayerTurnPopup";
import GameResultPopup from "./GameResultPopup";
import { Button, Card } from "pixel-retroui";
import "../styles/components/gameboard.scss";

export interface GameBoardProps {
  playerDetails: [
    {
      name: string;
      choice: string;
    },
    playerTwo: {
      name: string;
      choice: string;
    }
  ];
  timer: number;
}
const GameBoard: FC<GameBoardProps> = ({ playerDetails, timer }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const playerOneDetails = playerDetails[0];
  const playerTwoDetails = playerDetails[1];

  const {
    gameState,
    gridClickCounter,
    gameResult,
    timeLeft,
    resetGame,
    handleGameGridClick,
  } = useGameBoard({ playerDetails, timer });

  return (
    <main
      className="text-center gamepage p-10 w-full"
      style={{ background: currentTheme.pageBg }}
    >
      <PlayerTurnPopup
        playerDetails={
          gridClickCounter % 2 !== 0 ? playerOneDetails : playerTwoDetails
        }
      />
      {gameResult.gameEnded && (
        <GameResultPopup gameResult={gameResult} resetGame={resetGame} />
      )}
      <h1
        className="text-4xl font-bold"
        style={{ color: currentTheme.textColor }}
      >
        Tic Tac Toe
      </h1>
      <div className="gamepage__playerdetails flex justify-between w-full m-5 mt-20">
        <div className="gamepage__playerdetails__one flex flex-col items-start">
          <p style={{ color: currentTheme.textColor }}>*Avatar*</p>
          <div
            className={`gamepage__playerdetails__name ${
              gridClickCounter % 2 !== 0 ? "turn-active" : ""
            }`}
          >
            <p style={{ color: currentTheme.textColor }}>
              {playerOneDetails.name}
            </p>
            <span
              className="text-5xl ml-3"
              style={{ color: currentTheme.textColor }}
            >
              {gridClickCounter % 2 !== 0 ? playerOneDetails.choice : ""}
            </span>
          </div>
        </div>
        <div className="gamepage__timer">
          <p className="text-3xl w-5" style={{ color: currentTheme.textColor }}>
            {timeLeft}
          </p>
        </div>

        <div className="gamepage__playerdetails__two flex flex-col items-end">
          <p style={{ color: currentTheme.textColor }}>*Avatar*</p>
          <div
            className={`gamepage__playerdetails__name ${
              gridClickCounter % 2 === 0 ? "turn-active" : ""
            }`}
          >
            <span
              className="text-5xl mr-3"
              style={{ color: currentTheme.textColor }}
            >
              {gridClickCounter % 2 === 0 ? playerTwoDetails.choice : ""}
            </span>
            <p style={{ color: currentTheme.textColor }}>
              {playerTwoDetails.name}
            </p>
          </div>
        </div>
      </div>
      <Card
        bg={currentTheme.bg}
        textColor={currentTheme.textColor}
        borderColor={currentTheme.borderColor}
        shadowColor={currentTheme.shadowColor}
        className="gamepage__grid"
      >
        {gameState.map((row, i) => (
          <div key={i} className={`gamepage__grid__${i} w-full flex`}>
            {row.map((box, j) => (
              <span
                key={j}
                style={{
                  borderBottom: `5px solid ${currentTheme.borderColor}`,
                  borderRight: `5px solid ${currentTheme.borderColor}`,
                }}
                onClick={() => handleGameGridClick(i, j)}
              >{`${box === "-" ? "" : box}`}</span>
            ))}
          </div>
        ))}
      </Card>
      <Button
        bg={currentTheme.bg}
        textColor={currentTheme.textColor}
        borderColor={currentTheme.borderColor}
        shadow={currentTheme.shadowColor}
        className="mt-20 w-60"
        onClick={resetGame}
      >
        Reset
      </Button>
    </main>
  );
};

export default GameBoard;
