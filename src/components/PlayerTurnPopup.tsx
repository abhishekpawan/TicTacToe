import { FC, useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import { Popup } from "pixel-retroui";

interface PlayerTurnPopupPorps {
  playerDetails: {
    name: string;
    choice: string;
  };
}

const PlayerTurnPopup: FC<PlayerTurnPopupPorps> = ({ playerDetails }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const closePopup = () => setIsPopupOpen(false);
  useEffect(() => {
    setTimeout(() => {
      closePopup();
    }, 1000);
  }, []);

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
          <h1
            className="text-3xl mb-4 font-bold"
            style={{ color: currentTheme.textColor }}
          >
            Game Starts
          </h1>
          <p
            className="mb-4 font-bold"
            style={{ color: currentTheme.textColor }}
          >
            {playerDetails.name}'s Turn
          </p>
          <p
            className="text-8xl font-bold"
            style={{ color: currentTheme.textColor }}
          >
            {playerDetails.choice}
          </p>
        </div>
      </Popup>
    </>
  );
};

export default PlayerTurnPopup;
