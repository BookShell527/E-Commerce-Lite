import React from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";

const Home = () => {
    const { userData } = React.useContext(UserContext);
    const history = useHistory();

    // avoid cant read property of undefined
    React.useEffect(() => {
        if (!userData.token) {
            history.push("/login");
        }
    }, [userData])
    
    return (
        <div>
            
        </div>
    );
}

export default Home;