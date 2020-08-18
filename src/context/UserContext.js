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

    // product state
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("auth-token");
    const [ productData, setProductData ] = React.useState([])

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
            }
            const productRes = await axios.get(`http://localhost:5000/product/`);
            setProductData(productRes.data);
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
        setProductData({});
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
    const reduceAmount = () => setAmount(m => m - 1)

    return (
        <UserContext.Provider value={{ userId, authToken, userData, amount, productData, setAmount, addAmount, reduceAmount, setUserData, setDisplayName, setEmail, setPassword, setConfirmPassword, setLogEmail, setLogPassword, logOut, registerSubmit, loginSubmit, loginGoogle }}>
            { children }
        </UserContext.Provider>
    );
}

export default UserProvider;