import React, {createContext} from "react";

export const UserContext = createContext(
    {
        user: {
            phone: {},
            userName: {},
        },
        setUser: () => {
        }
    }
);