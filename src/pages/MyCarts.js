import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Card, Form, FormControl } from "react-bootstrap";
import axios from 'axios'
import Modals from '../components/Modals';

const MyCharts = () => {
    const { userData, setUserData, amount, setAmount, addAmount, reduceAmount, dark } = React.useContext(UserContext);
    
    const [ carts, setCarts ] = React.useState([0]);

    const [ productId, setProductId ] = React.useState("");
    const [ tradeId, setTradeId ] = React.useState("");
    const [ imgLink, setImgLink ] = React.useState("");
    const [ title, setTitle ] = React.useState("");
    const [ price, setPrice ] = React.useState("");
    const [ sellerId, setSellerId ] = React.useState("");
    
    const [ search, setSearch ] = React.useState("");

    const history = useHistory();

    // avoid property of undefined
    React.useEffect(() => {
        if (localStorage.getItem("auth-token") === "") {
            history.push("/login");
        }
        if (userData.user !== undefined) {
            setCarts(userData.user.carts);
        }
    }, [userData]);

    // state and for modal
    const [ show, setShow ] = React.useState(false);
    const [ show2, setShow2 ] = React.useState(false);

    // carts functionality
    const changeCarts = async () => {
        const changeAmount = { productAmount: amount }

        // connect server and react
        const response = await axios.patch(`http://localhost:5000/user/editProduct/${productId}/${userData.user.id}/${tradeId}`, changeAmount);
        // setUserData
        setUserData({
            token: userData.token,
            user: response.data.user
        })

        // reset state
        setShow(false);
        setImgLink("");
        setPrice("");
        setSellerId("");
        setTitle("");
        setProductId("");
        setTradeId("");
        setAmount("");

        // refresh window
        window.location = "/my-account/carts";
    }

    const deleteCarts = async () => {
        // connect server and react
        const response = await axios.delete(`http://localhost:5000/user/deleteProduct/${productId}/${userData.user.id}/${tradeId}`);
    
        // set userData
        setUserData({
            token: userData.token,
            user: response.data.user
        });
    
        // reset state
        setTradeId("");
        setShow2(false);
        setProductId("");
    
        // refresh window
        window.location = "/my-account/carts";
    }

    const searchFilter = (item, index) => {
        if (carts === []) return <h4 className="pb-2">You have no product to buy</h4>;

        if (search !== "" && item.title.toLowerCase().indexOf(search.toLowerCase()) === -1) {
            return null
        }

        return (
            <div className={dark ? "acc-options acc-options-dark text-left pl-3 pr-1 pr-4 d-flex" : "acc-options acc-options-dark text-left pl-3 pr-1 pr-4 d-flex text-dark"} key={index}>
                <div className="d-inline-block">
                    <img src={item.imgLink} alt={item.title} width="100px" />
                    <h5 className="d-inline-block ml-3">{item.title} x{item.productAmount}</h5>
                </div>
                <div className="d-inline-block align-self-center ml-auto">
                    <Link to="/my-account/carts" className="text-danger">
                        <DeleteIcon style={{transform: "scale(1.4)"}} 
                            onClick={() => {
                                setProductId(item.id);
                                setTradeId(item.tradeId);
                                setShow2(true);
                            }}
                        />
                    </Link>
                    <Link to="/my-account/carts">
                        <EditIcon style={{transform: "scale(1.4)"}} className="ml-3" 
                            onClick={() => {
                                setShow(true);
                                setImgLink(item.imgLink);
                                setPrice(item.price);
                                setSellerId(item.sellerId);
                                setTitle(item.title);
                                setProductId(item.id);
                                setTradeId(item.tradeId);
                                setAmount(item.productAmount);
                            }}
                        />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="col-md-6 m-auto">
            <Card>
                <Card.Header className={dark ? "card-header card-header-dark text-center" : "card-header text-center"}>
                    <Link to="/my-account" className="d-inline-block float-left">
                        <ArrowBackIosIcon className="text-white mb-n1" />
                    </Link>
                    <h4 className="text-white mb-0">My Carts</h4>
                </Card.Header>
                <Card.Body className={dark ? "card-body card-body-dark text-center p-0" : "card-body text-center p-0"}>
                <Form inline className="p-3">
                    <FormControl type="text" placeholder="Search" className="w-100" onChange={e => setSearch(e.target.value)} />
                </Form>
                    {
                        carts.map((m,i) => {
                            return searchFilter(m, i)
                        })
                    }
                </Card.Body>
            </Card>
            <Modals show={show} edit={true} 
                onClicks={ changeCarts }
                title="Edit & Product Detail"
                onHides={
                    () => {
                    setShow(false);
                    setImgLink("");
                    setPrice("");
                    setSellerId("");
                    setTitle("");
                    setProductId("");
                    setTradeId("");
                    setAmount("");
                }}>
                    <img src={imgLink} alt={title} width="200" />
                    <h6 className="mt-3">Name: {title}</h6>
                    <h6>Product ID: {productId}</h6>
                    <h6>Price: ${parseFloat(price)}</h6>
                    <h6>Seller ID: {sellerId}</h6>
                    <h5>Amount</h5>
                    <h5>
                        <button className="btn btn-danger mr-3" onClick={reduceAmount}>-</button>
                        {amount}
                        <button className="btn btn-primary ml-3" onClick={addAmount}>+</button>
                    </h5>
                    <h5>Total</h5>
                    <h5>
                        ${ amount * parseInt(price) }
                    </h5>
                </Modals>
                <Modals show={show2} edit={false} title="Delete From Carts"
                    onClicks2={() => {
                        setTradeId("");
                        setShow2(false);
                        setProductId("");
                    }}
                    onClicks={deleteCarts}
                    onHides={() => {
                        setTradeId("");
                        setShow2(false);
                        setProductId("");
                    }}
                >
                    Are You Sure
                </Modals>
        </div>
    );
}

export default MyCharts;