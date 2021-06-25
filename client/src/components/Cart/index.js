import React from "react";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import "./style.css";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART } from "../../utils/actions";

const Cart = () => {
  const [state, dispatch] = useStoreContext();

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
              <button>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">😱</span>You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
