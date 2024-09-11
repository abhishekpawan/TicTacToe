import { FC, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import { Button, Popup } from "pixel-retroui";
import { Link } from "react-router-dom";

interface GameResultPopupProps {
  gameResult: {
    playerDetails: {
      name: string;
      choice: string;
    };
    isDraw: boolean;
    gameEnded: boolean;
  };
  resetGame: () => void
}

const GameResultPopup: FC<GameResultPopupProps> = ({ gameResult,resetGame }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <Popup
        bg={currentTheme.bg}
        baseBg={currentTheme.shadowColor}
        textColor={currentTheme.textColor}
        borderColor={currentTheme.borderColor}
        isOpen={isPopupOpen}
        onClose={closePopup}
        className="text-center"
      >
        <div className="flex flex-col m-4">
          {gameResult.isDraw ? (
            <h1
              className="text-3xl mb-4"
              style={{ color: currentTheme.textColor }}
            >
              "No Winners This Time!"
            </h1>
          ) : (
            <>
              <h1
                className="text-5xl mb-4"
                style={{ color: currentTheme.textColor }}
              >
                Winner!!!
              </h1>
              <p className="text-4xl" style={{ color: currentTheme.textColor }}>
                {gameResult.playerDetails.name}
              </p>
            </>
          )}
          <Button
            bg={currentTheme.bg}
            textColor={currentTheme.textColor}
            borderColor={currentTheme.borderColor}
            shadow={currentTheme.shadowColor}
            className="m-10"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            bg={currentTheme.bg}
            textColor={currentTheme.textColor}
            borderColor={currentTheme.borderColor}
            shadow={currentTheme.shadowColor}
            onClick={resetGame}
            className=""
          >
            <Link to="/play">Play Again</Link>
          </Button>
        </div>
      </Popup>
    </>
  );
};

export default GameResultPopup;
