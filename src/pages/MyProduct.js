import React, { useState } from 'react';
import { Card, Form, FormControl, Modal, Button, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { UserContext } from '../context/UserContext';
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import Modals from "../components/Modals";
import { useContext } from 'react';

const MyProduct = () => {
    const { userId, userData, productData, authToken } = React.useContext(UserContext);

    const [ productId, setProductId ] = useState("");
    
    const [ search, setSearch ] = useState("");

    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ price, setPrice ] = useState(0);
    const [ imgLink, setImgLink ] = useState("");

    const [ show, setShow ] = useState(false);
    const [ show2, setShow2 ] = useState(false);

    const history = useHistory();
    console.log(userId);

    React.useEffect(() => {
        if (!authToken || authToken === "" || authToken === undefined || authToken === null) {
            history.push("/login");
        }
    }, [userData])

    const sellProduct = async () => {
        const sendData = {
            title,
            description,
            price,
            imgLink
        }

        if (title === "" || description === "" || price === 0 || price <= 0 || imgLink === "") {
            setShow(false);
            setShow2(true);
            return;
        }

        const sellRes = await axios.post(`http://localhost:5000/product/sell/${userId}`, sendData);

        setShow(false);
        setTitle("");
        setDescription("");
        setPrice("");
        setImgLink("");

        window.location = "/my-account/my-product";
    }

    const sellerProduct = productData.filter(m => m.sellerId === userId);
    console.log(sellerProduct);

    const searchFilter = (item, index) => {
        if (search !== "" && item.title.toLowerCase().indexOf(search.toLowerCase()) === -1) {
            return null
        }

        // error without this, idk why
        const setInfo = () => {
            setProductId(item._id);
        }

        return (
            <div className="acc-options text-left pl-3 pr-1 pr-4 d-flex" key={index}>
                <div className="d-inline-block">
                    <img src={item.imgLink} alt={item.title} width="100px" />
                    <h5 className="d-inline-block ml-3">{item.title}</h5>
                </div>
                <div className="d-inline-block align-self-center ml-auto">
                    <Link onClick={ setInfo } to={`/my-account/my-product/${productId}`}>
                        <button className="btn btn-primary ml-3">Detail & Edit</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="col-md-6 m-auto">
            <Card>
                <Card.Header className="card-header text-center">
                    <Link to="/my-account" className="d-inline-block float-left">
                        <ArrowBackIosIcon className="text-white mb-n1" />
                    </Link>
                    <h4 className="text-white mb-0">My Product</h4>
                </Card.Header>
                <Card.Body className="card-body text-center p-0">
                    <Form inline className="p-3">
                        <FormControl type="text" placeholder="Search" className="w-100" onChange={e => setSearch(e.target.value)} />
                    </Form>
                    <div className="px-4 pb-2 pt-3 add-product" style={{cursor: "pointer"}} onClick={() => setShow(true)} >
                        <h4 className="text-primary text-left" >Add New Product <AddIcon className="mb-1" /></h4>
                    </div>
                    {
                        sellerProduct.map((m,i) => {
                            return searchFilter(m,i)
                        })
                    }
                </Card.Body>
            </Card>
            <Modal show={show} 
            onHide={() => {
                setShow(false);
                setTitle("");
                setDescription("");
                setPrice("");
                setImgLink("");
            }}
            >
                <Modal.Header>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label className="d-inline">Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title..." className="d-inline-block" onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Description..." onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter Price in USD..." onChange={e => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="imgLink">
                            <Form.Label>Image Link</Form.Label>
                            <Form.Control type="text" placeholder="Enter Image Link..." onChange={e => setImgLink(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="primary" onClick={sellProduct} className="m-auto">
                        Add New Product
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modals error={true} onClicks={() => setShow2(false)} onHides={() => setShow2(false)} show={show2}>
                <Alert variant="danger">
                    <h4>There is some Error</h4>
                </Alert>
            </Modals>
        </div>
    );
}

export default MyProduct;