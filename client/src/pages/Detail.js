import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from "../utils/actions";
import { QUERY_PRODUCTS } from "../utils/queries";
import Cart from "../components/Cart";
import spinner from "../assets/spinner.gif";

function Detail() {
  // get GSO
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  // query data using Apollo
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // destructure products and cart out of state
  const { products, cart } = state;
  // const products = data?.products || [];

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });
  };

  // checks for data in GSO products array, if there is, find which product is current one we want to display
  useEffect(() => {
    if (products.length) {
      // find product with matching _id from useParams() Hook
      setCurrentProduct(products.find((product) => product._id === id));
      // if no products in GSO, like if first time loading app
      // use product data returned from useQuery() Hook to set product data to GSO
    } else if (data) {
      // we're not saving current product to GSO, only locally bc it's only used in this specific component at this specific moment
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
    }
    // DEPENDENCY ARRAY: when there is data in products array, run setCurrentProduct to  display single product data
  }, [products, data, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
