import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Card, Accordion, Button } from "react-bootstrap";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const ProductPage = props => {
    const { productId } = props.match.params;
    const [ dataProduct, setDataProduct ] = React.useState({});
    const [ ordered, setOrdered ] = React.useState([]);
    
    React.useEffect(() => {
        const getDataProduct = async () => {
            const productRes = await axios.get(`http://localhost:5000/product/${productId}`);
            setDataProduct(productRes.data);
            setOrdered(productRes.data.ordered);
        }
        getDataProduct();
    }, [])

    console.log(dataProduct);

    return (
        <div className="col-md-6 m-auto">
            <Card className="mb-5">
                <Card.Header className="card-header text-center">
                    <Link to="/my-account" className="d-inline-block float-left">
                        <ArrowBackIosIcon className="text-white mb-n1" />
                    </Link>
                    <h4 className="text-white mb-0">{ dataProduct.title }</h4>
                </Card.Header>
                <Card.Body className="card-body text-center py-3">
                    <img src={dataProduct.imgLink} alt={dataProduct.title} width="200px" />
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
                                            ordered.map((m, i) => {
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
        </div>
    );
}

export default ProductPage;