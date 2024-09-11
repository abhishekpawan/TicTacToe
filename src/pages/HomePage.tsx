import { Button, Popup } from "pixel-retroui";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes"
import "../styles/pages/homepage.scss";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <main className="homepage" style={{ background: currentTheme.pageBg }}>
      <h1
        className="homepage__header"
        style={{ color: currentTheme.textColor }}
      >
        Tic Tac Toe
      </h1>
      <Button
        bg={currentTheme.bg}
        textColor={currentTheme.textColor}
        borderColor={currentTheme.borderColor}
        shadow={currentTheme.shadowColor}
        onClick={openPopup}
        className="homepage__start-btn"
      >
        Start
      </Button>
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        className="homepage__popup"
        bg={currentTheme.bg}
        baseBg={currentTheme.shadowColor}
        textColor={currentTheme.textColor}
        borderColor={currentTheme.borderColor}
      >
        <Button
          bg={currentTheme.bg}
          textColor={currentTheme.textColor}
          borderColor={currentTheme.borderColor}
          shadow={currentTheme.shadowColor}
          className="homepage__popup__btn"
        >
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button
          bg={currentTheme.bg}
          textColor={currentTheme.textColor}
          borderColor={currentTheme.borderColor}
          shadow={currentTheme.shadowColor}
          className="homepage__popup__btn"
        >
          <Link to="/play/random-match">Play Anonymously</Link>
        </Button>
      </Popup>
    </main>
  );
};

export default HomePage;
