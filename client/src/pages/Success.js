import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations";
import { idbPromise } from "../utils/helpers";

function Success() {
  const [addOrder] = useMutation(ADD_ORDER);

  useEffect(() => {
    // async: read from idb and call addOrder() mutation
    async function saveOrder() {
      // read from idb to get all cart items
      const cart = await idbPromise("cart", "get");
      // map cart items into array of product IDs
      const products = cart.map((item) => item._id);

      // pass product IDs to addOrder() mutation
      if (products.length) {
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;

        // delete all IDs from idb store
        productData.forEach((item) => {
          idbPromise("cart", "delete", item);
        });
      }
      setTimeout(() => {window.location.assign("/")}, 3000);
    }

    saveOrder();
  }, [addOrder]);

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the homepage</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
