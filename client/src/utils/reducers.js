import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
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