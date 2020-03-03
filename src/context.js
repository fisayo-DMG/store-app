import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct,
    cart: storeProducts,
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = storeProducts.map(product => {
      return { ...product };
    });
    this.setState({
      products
    });

    // let tempProducts = [];
    // storeProducts.forEach(item => {
    //   const singleItem = {...item};
    //   tempProducts = [...tempProducts, singleItem]
    // });

    // this.setState(() => {
    //   return {products: tempProducts}
    // })
  };

  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  getNewItem = id => {
    let product = storeProducts.find(item => item.id === id);
    return {...product}
    // return product;
  }

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState({
      detailProduct: product
    });
  };
  // handleDetail = this.setState;

  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    // product.total = price * product.count;
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotals();
      }
    );
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState({
      modalProduct: product,
      modalOpen: true
    });
  };

  increment = id => {
    this.setState(
      prevState => {
        const product = prevState.cart.find(item => item.id === id);
        const index = prevState.cart.indexOf(product);
        const newProduct = { ...product };
        newProduct.count = newProduct.count + 1;
        newProduct.total = newProduct.price * newProduct.count;
        const productsArray = [...prevState.cart];
        productsArray.splice(index, 1, newProduct);

        return {
          cart: productsArray
        };
      },
      () => {
        // this.setProductTotal(id);
        this.addTotals();
      }
    );
  };

  // increment = () => {
  //   this.setState((prev) => {
  //     const product = prev.check.find(item => item.id === 2)
  //     const index = prev.check.indexOf(product);
  //     const newProduct = {...product};
  //     newProduct.count = newProduct.count + 1;
  //     const productsArray = [...prev.check];
  //     productsArray.splice(index, 1, newProduct);
  //     return {
  //       check: productsArray
  //     }
  //   }, () => console.log(this.state.check, 'test products'))
  // }

  decrement = id => {
    this.setState(
      prevState => {
        const product = prevState.cart.find(item => item.id === id);
        if (product.count === 1) {
          return this.removeItem(id);
        }
        const index = prevState.cart.indexOf(product);
        const newProduct = { ...product };
        newProduct.count = newProduct.count - 1;
        newProduct.total = newProduct.price * newProduct.count;
        const productsArray = [...prevState.cart];
        productsArray.splice(index, 1, newProduct);

        return {
          cart: productsArray
        };
      },
      () => {
        // this.setProductTotal(id);
        this.addTotals();
      }
    );
  };

  removeItem = id => {
    const newProduct = this.getNewItem(id);
    this.setState(
      prev => {
        let newProducts = prev.products.map(product => {
          if(product.id === id) {
            return newProduct
          }
          return {...product}
        });

        // const product = prev.cart.find(item => item.id === id);
        // const index = prev.cart.indexOf(product);
        // const cartArray = [...prev.cart];
        // cartArray.splice(index, 1);
        const cartArray = prev.cart.filter(item => item.id !== id);
        return {
          products: newProducts,
          cart: cartArray
        };
      },
      () => {
        this.addTotals();
      }
    );
  };

  clearCart = () => {
    this.setState(
      {
        cart: [],
        // cartSubTotal: 0

      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  };

  // setProductTotal = id => {
  //   this.setState(
  //     prev => {
  //       const product = prev.cart.find(item => item.id === id);
  //       const index = prev.cart.indexOf(product);
  //       const newProduct = { ...product };
  //       newProduct.total = newProduct.count * newProduct.price;
  //       const productsArray = [...prev.cart];
  //       productsArray.splice(index, 1, newProduct);

  //       return {
  //         cart: productsArray
  //       };
  //     },
  //     () => {
  //       this.addTotals();
  //     }
  //   );
  // };

  addTotals = () => {
    let subTotal = 0;
    this.setState(prev => {
      subTotal = prev.cart.reduce((acc, val) => {
        return acc + val.total;
      }, 0);
      const cartTax = Number((subTotal * 0.1).toFixed(2));
      const cartTotal = subTotal + cartTax;

      return {
        cartSubTotal: subTotal,
        cartTax,
        cartTotal
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          setProductTotal: this.setProductTotal,
          addTotals: this.addTotals
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
