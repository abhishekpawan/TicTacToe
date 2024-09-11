import { useAuth } from "../auth/authContext";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import { Button } from "pixel-retroui";
import { Link } from "react-router-dom";

const RandomMatchmakingPage = () => {
  const { theme } = useTheme();
  const { isUserLoggedIn } = useAuth();
  const currentTheme = themes[theme];

  return (
    <main className="random-match" style={{ background: currentTheme.pageBg }}>
      {/* // matchmaking in progress */}
      <div className="text-center py-40 h-full flex flex-col justify-between">
        <h1
          className="text-4xl font-bold"
          style={{ color: currentTheme.textColor }}
        >
          Finding a Match
        </h1>
        {/* generate random player names and avatar if user is not logged in */}
        <p style={{ color: currentTheme.textColor }}> *player name*</p>
        <p style={{ color: currentTheme.textColor }}>*PLayer Avatar*</p>
        <div className="m-20" style={{ color: currentTheme.textColor }}>
          <p className="m-20" style={{ color: currentTheme.textColor }}>
            Loading Animation
          </p>
          <Button
            bg={currentTheme.bg}
            textColor={currentTheme.textColor}
            borderColor={currentTheme.borderColor}
            shadow={currentTheme.shadowColor}
          >
            <Link to="/">Cancel</Link>
          </Button>
          <Button
            bg={currentTheme.bg}
            textColor={currentTheme.textColor}
            borderColor={currentTheme.borderColor}
            shadow={currentTheme.shadowColor}
          >
            <Link to="/play">Proceed</Link>
          </Button>
        </div>
      </div>
      {/* //after succesfull matchmaking navigate to actual game page */}
    </main>
  );
};

export default RandomMatchmakingPage;
