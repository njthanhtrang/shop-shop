// used in ProductList component, add offline capabilities, persist product data
export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
// store list of categories in global state
export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
// select category from state created by UPDATE_CATEGORIES action
//  and display products for that category from list created by UPDATE_PRODUCTS action
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";

export const ADD_TO_CART = "ADD_TO_CART";
export const ADD_MULTIPLE_TO_CART = "ADD_MULTIPLE_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";
export const TOGGLE_CART = "TOGGLE_CART";
