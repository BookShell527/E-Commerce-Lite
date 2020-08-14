import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal, Button, Card, Form, FormControl } from "react-bootstrap";
import axios from 'axios'
import Modals from '../components/Modals';

const MyCharts = () => {
    const { userData, setUserData, amount, setAmount, addAmount, reduceAmount } = React.useContext(UserContext);
    const [ carts, setCarts ] = React.useState([0]);
    const [ productId, setProductId ] = React.useState("");
    const [ search, setSearch ] = React.useState("");

    // avoid property of undefined
    React.useEffect(() => {
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
        const response = await axios.post(`http://localhost:5000/user/editProduct/${productId}/${userData.user.id}`, changeAmount);
        // setUserData
        setUserData({
            token: userData.token,
            user: response.data.user
        })

        // reset state
        setShow(false);
        setProductId("");
        setAmount("");

        // refresh window
        window.location = "/my-account/carts";
    }

    const deleteCarts = async () => {
        // connect server and react
        const response = await axios.post(`http://localhost:5000/user/deleteProduct/${productId}/${userData.user.id}`);
    
        // set userData
        setUserData({
            token: userData.token,
            user: response.data.user
        });
    
        // reset state
        setProductId("");
    
        // refresh window
        window.location = "/my-account/carts";
    }

    const searchFilter = item => {
        
    }

    return (
        <div className="col-md-6 m-auto">
            <Card>
                <Card.Header className="card-header text-center">
                    <Link to="/my-account" className="d-inline-block float-left">
                        <ArrowBackIosIcon className="text-white mb-n1" />
                    </Link>
                    <h4 className="text-white mb-0">My Carts</h4>
                </Card.Header>
                <Card.Body className="card-body text-center p-0">
                <Form inline className="p-3">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 w-75" />
                    <Button variant="outline-primary">Search</Button>
                </Form>
                    {
                        carts.map((m,i) => {
                            return (
                                <div className="acc-options text-left pl-3 pr-1 pr-4 d-flex" key={i}>
                                    <div className="d-inline-block">
                                        <img src={m.imgLink} alt={m.title} width="100px" />
                                        <h5 className="d-inline-block ml-3">{m.title} x{m.productAmount}</h5>
                                    </div>
                                    <div className="d-inline-block align-self-center ml-auto">
                                        <Link to="/my-account/carts" className="text-danger">
                                            <DeleteIcon style={{transform: "scale(1.4)"}} 
                                                onClick={() => {
                                                    setProductId(m.id);
                                                    setShow2(true);
                                                }}
                                            />
                                        </Link>
                                        <Link to="/my-account/carts">
                                            <EditIcon style={{transform: "scale(1.4)"}} className="ml-3" 
                                                onClick={() => {
                                                    setShow(true);
                                                    setProductId(m.id);
                                                    setAmount(m.productAmount);
                                                }}
                                            />
                                        </Link>
                                    </div>
                                    <Modals show={show} edit={true} 
                                        onClicks={ changeCarts }
                                        onHides={
                                            () => {
                                            setShow(false);
                                            setProductId("");
                                            setAmount("");
                                        }}>
                                        <img src={m.imgLink} alt={m.title} width="200" />
                                        <h6 className="mt-3">Name: {m.title}</h6>
                                        <h6>Product ID: {m.id}</h6>
                                        <h6>Price: ${parseFloat(m.price)}</h6>
                                        <h6>Seller ID: {m.sellerId}</h6>
                                        <h5>Amount</h5>
                                        <h5>
                                            <button className="btn btn-danger mr-3" onClick={reduceAmount}>-</button>
                                            {amount}
                                            <button className="btn btn-primary ml-3" onClick={addAmount}>+</button>
                                        </h5>
                                        <h5>Total</h5>
                                        <h5>
                                            ${ amount * parseInt(m.price) }
                                        </h5>
                                    </Modals>
                                    <Modals show={show2} edit={false}
                                        onClicks2={() => setShow2(false)}
                                        onClicks={deleteCarts}
                                        onHides={() => {
                                            setShow2(false);
                                            setProductId("");
                                        }}
                                    >
                                        Are You Sure
                                    </Modals>
                                </div>
                            )
                        })
                    }
                </Card.Body>
            </Card>
        </div>
    );
}

export default MyCharts;