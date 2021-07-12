import React from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
    const { userId, userData, productData, authToken, loading, setLoading } = React.useContext(UserContext);
    const history = useHistory();

    // avoid cant read property of undefined
    React.useEffect(() => {
        if (authToken === "" || authToken === undefined ) {
            history.push("/login");
        }
        if (userData.user !== undefined) {
            setLoading(false)
        }
        console.log(userData)
    }, [history, authToken, userData, setLoading]);

    const filteredProduct = productData.filter(m => m.sellerId !== userId);

    if (loading) {
        return <h3 className="mt-5 text-center">Loading...</h3>
    } else {
        return (
            <div className="pr-4">
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
}

export default Home;
