import { Button } from "pixel-retroui";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import useGamePage from "../customHooks/useGamePage";
import "../styles/pages/gamepage.scss";
import PlayerTurnPopup from "../components/PlayerTurnPopup";
import GameResultPopup from "../components/GameResultPopup";

const GamePage = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const {
    gameState,
    gridClickCounter,
    playerOneDetails,
    playerTwoDetails,
    gameResult,
    resetGame,
    handleGameGridClick,
  } = useGamePage();

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
      {gameResult.gameEnded && <GameResultPopup gameResult={gameResult} resetGame={resetGame} />}
      <h1
        className="text-4xl font-bold"
        style={{ color: currentTheme.textColor }}
      >
        Tic Tac Toe
      </h1>
      <div className="gamepage__playerdetails flex justify-between w-full m-5 mt-20">
        <div className="gamepage__playerdetails__one flex flex-col items-start">
          <p>*Avatar*</p>
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

        <div className="gamepage__playerdetails__two flex flex-col items-end">
          <p>*Avatar*</p>
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
      <div className="gamepage__grid">
        {gameState.map((row, i) => (
          <div key={i} className="gamepage__grid__one w-full">
            {row.map((box, j) => (
              <span key={j} onClick={() => handleGameGridClick(i, j)}>{`${
                box === "-" ? "" : box
              }`}</span>
            ))}
          </div>
        ))}
      </div>
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

export default GamePage;
