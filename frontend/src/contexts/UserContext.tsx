import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../types/types";

interface UserContextType {
    user?: User | undefined;
    setUser: (user: User | undefined) => void;
    name?: string | undefined;
    setName: (name: string | undefined) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined)

    return (
        <UserContext.Provider value={{user, setUser , name , setName}}>
        { children }
        </UserContext.Provider>
    );

}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};