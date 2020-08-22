import React from 'react'
import { Card, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const ProductCard = props => {
    const { authToken, userId, setUserData, productData, dark } = React.useContext(UserContext);
    const [ show, setShow ] = React.useState(false);
    const [ amount, setAmount ] = React.useState(0);
    const addToCarts = async () => {
        if (props.sellerId === userId) {
            setShow(true);
            return;
        }

        const productAmount = {
            productAmount: amount
        }

        const res = await axios.post(`http://localhost:5000/user/addProduct/${props.productId}/${userId}`, productAmount);

        setShow(false);

        window.location = "/my-account/carts";
    }

    return (
        <Card style={{ width: '18rem' }} className="d-inline-block ml-3" >
            <Card.Img variant="top" src={props.img} />
            <Card.Body className={dark ? "card-body-dark" : null}>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Button variant="primary" onClick={() => setShow(true)} >Add to carts</Button>
            </Card.Body>
            <Modal show={show} 
            onHide={() => {
                setShow(false);
                setAmount(0);
            }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Form>
                        <Form.Group controlId="price">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter Amount..." onChange={e => setAmount(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <h5>Total</h5>
                    <h5>${ parseFloat(props.price) * amount }</h5>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="primary" onClick={addToCarts} className="m-auto">
                        Add To Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default ProductCard;