import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

export default function Navbar() {
    const classes = useStyles();

    const { userData, dark, darkMode } = React.useContext(UserContext);
    return (
        <div className={classes.root} id="nav-root">
            <AppBar position="static" className={ dark ? "nav-dark" : null }>
                <Toolbar variant="dense">
                    <Link to="/" className="text-white text-decoration-none ml-5">
                        <Typography variant="h6" color="inherit">
                            E-Commerce Lite
                        </Typography>
                    </Link>
                    { 
                        userData.user
                        ? <>
                            {dark ? <Link className="ml-auto text-white mr-3" onClick={darkMode}><Brightness4Icon /></Link> : <Link className="ml-auto text-white mr-3" onClick={darkMode}><Brightness7Icon /></Link>}
                            <Link to="/my-account/carts" className="mr-3 text-white"><ShoppingCartIcon /></Link>
                            <Link to="/my-account" className="btn text-white mr-5"><AccountCircleIcon /> My Account</Link>
                        </>
                        : <>
                            <Link to="/register" className="ml-auto mr-4 text-white text-decoration-none">Sign Up</Link>
                            <Link to="/login" className="mr-5 text-white text-decoration-none">Sign In</Link>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}