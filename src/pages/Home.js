import React from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Modals from "../components/Modals";

const Home = () => {
    const { userId, userData, authToken, productData } = React.useContext(UserContext);
    const history = useHistory();

    // try to avoid filter of undefined
    const [ newProductData, setNewProductData ] = React.useState([]);

    const [ show, setShow ] = React.useState(false);

    // avoid cant read property of undefined
    React.useEffect(() => {
        if (!authToken || authToken === "" || authToken === undefined || authToken === null) {
            history.push("/login");
        }
        setNewProductData(productData);
    }, [])

    const filteredProduct = newProductData.filter(m => m.sellerId !== userId);

    return (
        <div className="px-4">
            {
                filteredProduct.map((m, i) => {
                    return (
                        <ProductCard 
                            price={m.price}
                            sellerId={m.sellerId}
                            productId={m._id}
                            key={i}
                            img={m.imgLink}
                            title={m.title}
                            description={m.description}
                        />
                    )
                })
            }
        </div>
    );
}

export default Home;