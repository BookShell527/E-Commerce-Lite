import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { UserContext } from "../context/UserContext";
import { Link, useHistory } from "react-router-dom";

const MyAccount = () => {
    const { authToken, userData, logOut } = React.useContext(UserContext);
    const [ user, setUser ] = React.useState("My Account");

    const history =  useHistory();

    // avoid cant read property of undefined
    React.useEffect(() => {
        if (!authToken || authToken === "" || authToken === undefined || authToken === null) {
            history.push("/login");
        }
        if (userData.user !== undefined) {
            setUser(userData.user);
        }
    }, [userData]);

    return (
        <div className="col-md-6 m-auto">
            <div className="card">
                <div className="card-header text-center">
                    <AccountCircleIcon style={{transform: "scale(2)"}} className="text-white" />
                    <h4 className="text-white mt-3 m-0">{ user.displayName }</h4>
                </div>
                <div className="card-body text-center">
                    <div className="text-left mb-3">
                        <h6>User ID: { user.id }</h6>
                        <h6>Display Name: { user.displayName }</h6>
                        <h6>Email: { user.email }</h6>
                    </div>
                    <Link to="/my-account/carts" className="text-decoration-none">
                        <div className="acc-options text-left pl-1 pr-1 text-dark">My Carts <ArrowForwardIosIcon className="float-right" /></div>
                    </Link>
                    <Link to="/my-account/my-product" className="text-decoration-none">
                        <div className="acc-options text-left pl-1 pr-1 text-dark">My Product <ArrowForwardIosIcon className="float-right" /></div>
                    </Link>
                    <div className="mt-3">
                        <Link to="/login" className="text-danger text-decoration-none mt-2 logout" onClick={logOut}><ExitToAppIcon />Log Out</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;