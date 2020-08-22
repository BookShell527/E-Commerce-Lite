import React from 'react'
import { UserContext } from '../context/UserContext';

const Error = () => {
    const { dark } = React.useContext(UserContext);
    return (
        <>
            <h1 className={dark ? "mt-5 text-center text-white" : "mt-5 text-center"}>This page doesn't exist</h1>
        </>
    );
}

export default Error;