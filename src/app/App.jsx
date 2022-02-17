import AppCss from './App.module.scss';
import React, {useState} from "react";
import SeckillRouter from "../router/SeckillRouter";
import {UserContext} from "../context/UserContext";

export default function App() {
    const [user, setUser] = useState();

    return (
        <div className={AppCss.app + ' ' + AppCss.full}>
            <UserContext.Provider value={{user, setUser}}>
                <SeckillRouter/>
            </UserContext.Provider>
        </div>

    );
}
