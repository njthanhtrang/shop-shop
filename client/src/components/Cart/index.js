import React, { useEffect } from "react";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import "./style.css";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from "../../utils/queries";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/client";

// for checkout redirect
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  // data variable contains checkout session after query called with getCheckout()
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  // check if there's anything in state's cart property on load
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");
      // we have array of items returning from idb, even if just 1 product saved
      // dump all products into GSO at once instead of 1 by 1
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    // if nothing in state's cart property, retrieve data from idb cart obj store
    // save to GSO
    if (!state.cart.length) {
      getCart();
    }
    // dependency array, if nothing to retrieve from cached obj store and state.cart.length = 0
    // it will continuously run if we don't include state.cart.length in dep arr
    // list all data that useEffect() Hook depends on to execute
    // Hook runs on load no matter what but only runs again if any value in dep arr changed since last time it ran
  }, [state.cart.length, dispatch]);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  // when user clicks Checkout, loop over items saved in state.cart
  // add IDs to productIds array for QUERY_CHECKOUT query to generate Stripe session
  function submitCheckout() {
    const productIds = [];

    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds }
    });
  }

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        {/* always wrap emojis in <span> with role adn aria-lable, helps screen readers */}
        <span
          role="img"
          //   component will return smaller <div> which onclick, sets cartOpen to true and returns expanded shopping cart
          aria-label="trash"
        >
          🛒
        </span>
      </div>
    );
  }

  console.log(state);

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {/* items on state.cart mapped into series of <CartItem /> components */}
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {/* conditionally render checkout button */}
            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
