import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from "./components/Navbar";
import UserProvider from './context/UserContext'
import MyAccount from './pages/MyAccount';
import MyCarts from './pages/MyCarts';
import MyProduct from './pages/MyProduct';
import ProductPage from './pages/ProductPage';

export default function App() {
  return ( 
    <BrowserRouter>
      <UserProvider>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/my-account" component={MyAccount} />
          <Route exact path="/my-account/carts" component={MyCarts} />
          <Route exact path="/my-account/my-product" component={MyProduct} />
          <Route exact path="/my-account/my-product/:productId" component={ProductPage} />
        </Switch>
      </UserProvider>
    </BrowserRouter>
  );
}