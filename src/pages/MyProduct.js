import React from 'react';
import { Card, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { UserContext } from '../context/UserContext';

const MyProduct = () => {
    const { userData, productData } = React.useContext(UserContext);
    const [ userId, setUserId ] = React.useState("");

    const [ productId, setProductId ] = React.useState("");
    
    const [ search, setSearch ] = React.useState("");

    React.useEffect(() => {
        if (userData.user !== undefined) {
            setUserId(userData.user.id)
        }
    }, [userData])

    const sellerProduct = productData.filter(m => m.sellerId === userId);

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
                    {
                        sellerProduct.map((m,i) => {
                            return searchFilter(m,i)
                        })
                    }
                </Card.Body>
            </Card>
        </div>
    );
}

export default MyProduct;