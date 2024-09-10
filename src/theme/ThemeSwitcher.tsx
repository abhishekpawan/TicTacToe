import React from 'react';
import { useTheme } from './ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'color')}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="color">Color</option>
      </select>
    </div>
  );
};
