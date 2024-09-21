import { FC, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import { Button, Popup } from "pixel-retroui";
import { Link, useNavigate } from "react-router-dom";

interface GameResultPopupProps {
  gameResult: {
    playerDetails: {
      name: string;
      choice: string;
    };
    isDraw: boolean;
    gameEnded: boolean;
  };
  resetGame: () => void;
}

const GameResultPopup: FC<GameResultPopupProps> = ({
  gameResult,
  resetGame,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate()
  const currentTheme = themes[theme];
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    navigate("")
  };

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
              className="text-3xl mb-4 font-bold"
              style={{ color: currentTheme.textColor }}
            >
              "No Winners This Time!"
            </h1>
          ) : (
            <>
              <h1
                className="text-5xl mb-4 font-bold"
                style={{ color: currentTheme.textColor }}
              >
                Winner!!!
              </h1>
              <p
                className="text-4xl font-bold"
                style={{ color: currentTheme.textColor }}
              >
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
            onClick={() => navigate("/")}
            className=""
          >
            Play Again
          </Button>
        </div>
      </Popup>
    </>
  );
};

export default GameResultPopup;
