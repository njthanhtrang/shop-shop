import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  // retrieve current GSO and dispatch() to update state
  const [state, dispatch] = useStoreContext();

  // destructure currentCategory from state obj, to use in filterProducts()
  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // wait for useQuery() response to come in
  useEffect(() => {
    // when data obj from useQuery goes from undefiend to having value
    if (data) {
      // if there's data to be stored, store in global state obj
      dispatch({
        type: UPDATE_PRODUCTS,
       // instructs reducer fx to save array of product data to GSO
        products: data.products
      });

      // also take each product and save to IndexedDB using helper fx
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });

      // add else if to check if "loading" is undefined in "useQuery()" Hook
    } else if (!loading) {
      // since we're offline, get all data form "products" store
      idbPromise("products", "get").then((products) => {
        // use retrieved array product data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);

  // const products = data?.products || [];

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
