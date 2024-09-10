import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";

const RandomMatchmakingPage = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  return (
  <main className="random-match" style={{ background: currentTheme.pageBg }}>
    <h1 style={{ color: currentTheme.textColor }}>Finding Match....</h1>
    <p style={{ color: currentTheme.textColor }}>Please wait!</p>
  </main>);
};

export default RandomMatchmakingPage;
