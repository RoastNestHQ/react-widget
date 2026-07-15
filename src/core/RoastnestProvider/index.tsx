import { useState, useCallback } from "react";
import { RoastnestContext } from "../context";
import { User, RoastnestProviderProps } from "../../shared/types";

function Provider({
    projectId,
    children,
    mode = "cloud",
    theme,
}: RoastnestProviderProps) {
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const setUser = useCallback((user: User) => setUserData(user), []);

    return (
        <RoastnestContext.Provider
            value={{
                mode,
                userData,
                setUser,
                projectId,
                theme,
            }}
        >
            {children}
        </RoastnestContext.Provider>
    );
}

const RoastnestProvider = ({ children, ...props }: RoastnestProviderProps) => (
    <Provider {...props}>
        {children}
    </Provider>
);

export default RoastnestProvider;
