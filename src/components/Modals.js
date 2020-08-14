import React from 'react'
import { Modal, Button, Card } from "react-bootstrap";

const Modals = props => {
    if (props.edit) {
        return (
            <Modal show={props.show}
                onHide={props.onHides}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="d-inline-block">Edit & Product Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {props.children}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="primary" 
                        onClick={props.onClicks} 
                    className="m-auto"
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    } else {
        return (
                <Modal show={props.show}
                    onHide={props.onHides}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="d-inline-block">Delete Product From The Charts</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        { props.children }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" 
                            onClick={ props.onClicks2 } 
                        >
                            No
                        </Button>
                        <Button variant="danger" 
                            onClick={ props.onClicks } 
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }


export default Modals;