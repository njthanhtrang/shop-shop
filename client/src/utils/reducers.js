import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART,
} from "./actions";
import { useReducer } from "react";

export const reducer = (state, action) => {
  switch (action.type) {
    // if action type value is "UPDATE_PRODUCTS"
    // return a new state obj with updated products array
    case UPDATE_PRODUCTS:
      // return new obj with copy of state arg
      return {
        ...state,
        // new array with action.products value spread across it
        products: [...action.products],
      };
    //   if action type value is "UPDATE_CATEGORIES"
    // return a new state obj with updated categories array
    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };

    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        // update to new string value
        currentCategory: action.currentCategory,
      };

    case ADD_TO_CART:
      return {
        ...state,
        // users immediately view cart with newly added item if not already open
        cartOpen: true,
        // add action.product to end of array
        cart: [...state.cart, action.product],
      };

    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    case REMOVE_FROM_CART:
      // only keep items that don't match _id of item removed
      let newState = state.cart.filter((product) => {
        return product._id !== action._id;
      });

      return {
        ...state,
        //   set cartOpen to false when array is empty
        cartOpen: newState.length > 0,
        cart: newState,
      };

    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        // use map() to create new array instead of updating state.cart directly --> OG STATE IMMUTABILITY
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    // if it's none of these action types
    // do not update state at all, keep things the same
    default:
      return state;
  }
};

// initialize global state obj, provide with functionality to update state
// automatically run it through our custom reducer()
export function useProductReducer(initialState) {
  // useReducer() Hook is for managing greater levels of state
  // compared to useState(), which is for form field values and button click status
  return useReducer(reducer, initialState);
}
