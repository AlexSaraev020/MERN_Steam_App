import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../types/types";

interface UserContextType {
    user?: User | undefined;
    userId?: string;
    userImage?: string | undefined;
    setUserImage: (userImage: string|undefined) => void
    setUser: (user: User | undefined) => void;
    setUserId: (userId: string) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userImage , setUserImage] = useState<string|undefined>(undefined);
    return (
        <UserContext.Provider value={{userId , setUserId , user, setUser , userImage , setUserImage}}>
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