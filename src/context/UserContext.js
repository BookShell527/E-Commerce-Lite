import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext(null);

const UserProvider = ({
    children
}) => {
    useContext(UserContext);
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    });

    // product state
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("auth-token");
    const [productData, setProductData] = useState([])

    // state for register
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // state for login
    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");

    // state for carts
    const [carts, setCarts] = useState([]);
    const [amount, setAmount] = useState(0);

    // state for dark mode
    const [dark, setDark] = useState(false);

    // state for loading
    const [loading, setLoading] = useState(true)

    const html = document.querySelector("html");
    const body = document.querySelector("body");
    if (dark) {
        html.style.backgroundColor = "#121212";
        body.style.backgroundColor = "#121212";
    } else if (!dark) {
        html.style.backgroundColor = "#fff";
        body.style.backgroundColor = "#fff";
    }

    const history = useHistory();

    // useEffect to avoid property of undefined
    React.useEffect(() => {
        // check if user logged in or not
        const checkedLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            let userIdStorage = localStorage.getItem("userId");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                localStorage.setItem("userId", "");
                token = "";
                userIdStorage = "";
            }
            const tokenRes = await axios.post('http://localhost:5000/user/tokenIsValid', null, 
                { 
                    headers: {
                        "x-auth-token": token,
                        "id": userIdStorage
                    }
                }
            );
            if (tokenRes.data) {
                const userRes = await axios.get('http://localhost:5000/user/', 
                    { 
                        headers: {
                            "x-auth-token": token,
                            "id": userIdStorage
                        }
                    }
                );
                setUserData({
                    token,
                    user: userRes.data
                });
                setDark(userRes.data.dark);
            }
            const productRes = await axios.get(`http://localhost:5000/product/`);
            setProductData(productRes.data);
        }
        checkedLoggedIn();
    }, [dark])


    // logout
    const logOut = () => {
        // reset userData
        setUserData({
            token: undefined,
            user: undefined
        });
        setProductData({});
        setDark(false);
        // reset token from localstorage
        localStorage.setItem("auth-token", "");
        localStorage.setItem("userId", "");
    }

    // register
    const registerSubmit = async e => {
        e.preventDefault();
        const newUser = {
            email,
            password,
            passwordCheck: confirmPassword,
            displayName,
            carts
        }

        // take data and set data
        await axios.post("http://localhost:5000/user/register", newUser);
        const loginRes = await axios.post("http://localhost:5000/user/login", {
            email,
            password
        });
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        });

        const productRes = await axios.get(`http://localhost:5000/product/`);
        setProductData(productRes.data);

        // add token to localstorage
        localStorage.setItem("auth-token", loginRes.data.token);
        localStorage.setItem("userId", loginRes.data.user.id);

        // reset state and change location
        setDisplayName("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");

        history.push("/");
    }

    // login
    const loginSubmit = async e => {
        e.preventDefault();

        // data to send
        const userLogin = {
            email: logEmail,
            password: logPassword
        };

        // take data and set data
        const loginRes = await axios.post("http://localhost:5000/user/login", userLogin);
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user,
        });

        const productRes = await axios.get(`http://localhost:5000/product/`);
        setProductData(productRes.data);

        // add token to localstorage
        localStorage.setItem("auth-token", loginRes.data.token);
        localStorage.setItem("userId", loginRes.data.user.id);

        // reset the state
        setLogEmail("");
        setLogPassword("");

        history.push("/");
    }

    // google login
    const loginGoogle = async res => {
        // data sended
        const googleData = {
            gooId: res.googleId,
            email: res.profileObj.email,
            displayName: `${res.profileObj.givenName} ${res.profileObj.familyName}`,
            carts
        }

        // backend -> react
        const checkAccount = await axios.post(`http://localhost:5000/user/loginGoogle`, googleData);

        const productRes = await axios.get(`http://localhost:5000/product/`);
        setProductData(productRes.data);

        // set userData
        setUserData({
            token: res.accessToken,
            user: checkAccount.data.user
        })

        // add token to localstorage and change location
        localStorage.setItem("auth-token", res.accessToken);
        localStorage.setItem("userId", checkAccount.data.user.id);
        history.push("/");
    }

    // change carts data
    const addAmount = () => setAmount(m => m + 1);
    const reduceAmount = () => setAmount(m => m - 1);

    // dark mode functions
    const darkMode = async () => {
        setDark(prev => !prev);

        const body = { dark: !dark }

        await axios.post(`http://localhost:5000/user/darkmode/${userId}`, body);
    }

    return ( <UserContext.Provider value = {
            {
                userId,
                authToken,
                userData,
                amount,
                productData,
                dark,
                loading,
                setLoading,
                darkMode,
                setAmount,
                addAmount,
                reduceAmount,
                setCarts,
                setUserData,
                setDisplayName,
                setEmail,
                setPassword,
                setConfirmPassword,
                setLogEmail,
                setLogPassword,
                logOut,
                registerSubmit,
                loginSubmit,
                loginGoogle
            }
        }> {
            children
        }</UserContext.Provider>
    );
}

export default UserProvider;