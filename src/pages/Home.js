import React from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
    const { userId, userData, productData } = React.useContext(UserContext);
    const history = useHistory();

    // try to avoid filter of undefined
    const [ newProductData, setNewProductData ] = React.useState([]);

    const [ show, setShow ] = React.useState(false);

    // avoid cant read property of undefined
    React.useEffect(() => {
        if (localStorage.getItem("auth-token") === "") {
            history.push("/login");
        }
    }, [])

    const filteredProduct = productData.filter(m => m.sellerId !== userId);

    console.log(userData);

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