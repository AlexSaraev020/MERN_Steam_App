import { createContext, useContext, useState, ReactNode } from "react";

interface Theme {
    theme: string;
    setTheme: (theme: string) => void;
}

export const ThemesContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState('emerald');

    return (
        <ThemesContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemesContext.Provider>
    );
};

export const useThemes = () => {
    const context = useContext(ThemesContext);
    if (!context) {
        throw new Error('useThemes must be used within a ThemeProvider');
    }
    return context;
};
