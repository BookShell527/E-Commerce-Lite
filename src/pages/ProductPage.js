import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import { Form, Card, Accordion, Button } from "react-bootstrap";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Modals from '../components/Modals';
import { UserContext } from '../context/UserContext';

const ProductPage = props => {
    const { productId, userData } = props.match.params;
    const { authToken } = React.useContext(UserContext);
    const [ dataProduct, setDataProduct ] = useState({});
    const [ ordered, setOrdered ] = useState([]);

    const [ show, setShow ] = useState(false);
    const [ show2, setShow2 ] = useState(false);

    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ price, setPrice ] = useState(0);
    const [ imgLink, setImgLink ] = useState("");

    const history = useHistory();

    React.useEffect(() => {
        if (!authToken || authToken === "" || authToken === undefined || authToken === null) {
            history.push("/login");
        }
        const getDataProduct = async () => {
            const productRes = await axios.get(`http://localhost:5000/product/${productId}`);
            setDataProduct(productRes.data);
            setOrdered(productRes.data.ordered);
            setTitle(productRes.data.title);
            setDescription(productRes.data.description);
            setPrice(parseFloat(productRes.data.price));
            setImgLink(productRes.data.imgLink);
        }
        getDataProduct();
    }, [])

    const deleteProduct = async () => {
        await axios.delete(`http://localhost:5000/product/delete/${productId}/${dataProduct.sellerId}`);
        window.location = "/my-account/my-product/";
    }

    const changeProduct = async () => {
        const editData ={
            title,
            description,
            price,
            imgLink
        }
        await axios.post(`http://localhost:5000/product/edit/${productId}`, editData);
        window.location = `/my-account/my-product/${productId}`;
    }

    return (
        <div className="col-md-6 m-auto">
            <Card className="mb-5">
                <Card.Header className="card-header text-center">
                    <Link to="/my-account/my-product" className="d-inline-block float-left">
                        <ArrowBackIosIcon className="text-white mb-n1" />
                    </Link>
                    <h4 className="text-white mb-0">{ dataProduct.title }</h4>
                </Card.Header>
                <Card.Body className="card-body text-center py-3">
                    <img src={dataProduct.imgLink} alt={dataProduct.title} width="200px" />
                    <div className="m-auto text-center pt-3">
                        <DeleteIcon style={{transform: "scale(1.4)", cursor: "pointer"}} className="text-danger mr-2" 
                            onClick={() => {
                                setShow(true);
                            }}
                            />
                        <EditIcon style={{transform: "scale(1.4)", cursor: "pointer"}} className="text-primary ml-2" 
                            onClick={() => {
                                setShow2(true);
                            }}
                        />
                    </div>
                    <h5 className="mt-3 mr-1">ID: {dataProduct._id}</h5>
                    <h5>Title: {dataProduct.title}</h5>
                    <h5>Description: {dataProduct.description}</h5>
                    <h5>Price: ${dataProduct.price}</h5>
                    <Accordion defaultActiveKey="0" className="w-100 m-auto mt-n5">
                        <Card className="mt-0">
                            <Card.Header className="bg-white">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Ordered By
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1" className="mb-5 m-auto mx-0">
                                <Card.Body className="p-0 mx-0">
                                        {
                                            ordered.length === 0 ? <h4>No one buy this product</h4>
                                            : ordered.map((m, i) => {
                                                return (
                                                    <div className="text-left pl-3 pr-4 py-2 d-flex w-100" key={i} >
                                                        <h5 className="d-inline-block ml-3" style={{cursor: "pointer"}}>{m.buyerEmail}</h5>
                                                    </div>
                                                )
                                            })
                                        }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Card.Body>
            </Card>
            <Modals show={show} edit={false}
                    onClicks2={() => {
                        setShow(false);
                    }}
                    title="Delete Product"
                    onClicks={deleteProduct}
                    onHides={() => {
                        setShow(false);
                    }}
                >
                    Are You Sure?
            </Modals>
            <Modals show={show2} edit={true} title="Edit Product"
                onClicks={changeProduct}
                onHides={() => {
                    setShow2(false);
                    setTitle(dataProduct.title)
                    setDescription(dataProduct.description)
                    setPrice(dataProduct.price)
                    setImgLink(dataProduct.imgLink)
                }}
            >
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label className="d-inline">Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter New Title..." className="d-inline-block" value={title} onChange={e => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter New Description..." value={description} onChange={e => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter New Price in USD..." value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="imgLink">
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control type="text" placeholder="Enter New Image Link..." value={imgLink} onChange={e => setImgLink(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modals>
        </div>
    );
}

export default ProductPage;