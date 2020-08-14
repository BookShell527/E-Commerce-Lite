import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    React.useContext(UserContext);
    const [ userData, setUserData ] = React.useState({
        token: undefined,
        user: undefined
    });

    // state for register
    const [ displayName, setDisplayName ] = React.useState("");
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const [ confirmPassword, setConfirmPassword ] = React.useState("");
    
    // state for login
    const [ logEmail, setLogEmail ] = React.useState("");
    const [ logPassword, setLogPassword ] = React.useState("");
    
    // state for carts
    const [ carts, setCarts ] = React.useState([]);
    const [ amount, setAmount ] = React.useState(0);

    const history = useHistory();

    // useEffect to avoid property of undefined
    React.useEffect(() => {
        // check if user logged in or not
        const checkedLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await axios.post('http://localhost:5000/user/tokenIsValid', null, 
                { 
                    headers: {
                        "x-auth-token": token
                    }
                }
            );
            if (tokenRes.data) {
                const userRes = await axios.get('http://localhost:5000/user/', 
                    { 
                        headers: {
                            "x-auth-token": token
                        },
                    }
                );
                setUserData({
                    token,
                    user: userRes.data
                });
            }
        }
        checkedLoggedIn();
    }, [])
    

    // logout
    const logOut = () => {
        // reset userData
        setUserData({
            token: undefined,
            user: undefined
        });
        // reset token from localstorage
        localStorage.setItem("auth-token", "");
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

        // connect node and react
        await axios.post("http://localhost:5000/user/register", newUser);
        const loginRes = await axios.post("http://localhost:5000/user/login", {
            email,
            password
        });

        // set userData
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        });

        // add token to localstorage
        localStorage.setItem("auth-token", loginRes.data.token);
        
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

        // connect node and react
        const loginRes = await axios.post("http://localhost:5000/user/login", userLogin);

        // set user data
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user,
        });

        // add token to localstorage
        localStorage.setItem("auth-token", loginRes.data.token);

        // reset the state
        setLogEmail("");
        setLogPassword("");

        history.push("/");
    }

    // google login
    const loginGoogle = res => {
        // set user data
        setUserData({
            token: res.accessToken,
            user: {
                id: res.googleId,
                displayName: res.profileObj.name,
                email: res.profileObj.email,
                carts: []
            }
        })

        // add token to localstorage and change location
        localStorage.setItem("auth-token", res.accessToken);
        history.push("/");
    }

    // change carts data
    const addAmount = () => setAmount(m => m + 1);
    const reduceAmount = () => setAmount(m => m - 1)

    return (
        <UserContext.Provider value={{ userData, amount, setAmount, addAmount, reduceAmount, setUserData, setDisplayName, setEmail, setPassword, setConfirmPassword, setLogEmail, setLogPassword, logOut, registerSubmit, loginSubmit, loginGoogle }}>
            { children }
        </UserContext.Provider>
    );
}

export default UserProvider;