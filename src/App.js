import React, { Component } from 'react';
import logo from "./logo.svg";
import "./App.css";
// import 'font-awesome/css/font-awesome.min.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar';
import Details from './components/Details';
import Cart from './components/Cart/Cart';
import Default from './components/Default';
import ProductList from './components/ProductList';
import Modal from './components/Modal'
import {Switch, Route} from 'react-router-dom';


class App extends Component {
  state = {  }
  render() { 
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={ProductList} />
          <Route path='/details' component={Details} />
          <Route path='/cart' component={Cart} />
          <Route component={Default} />
        </Switch>
        <Modal />
      </>
    );
  }
}
 

export default App;
