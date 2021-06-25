import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from "../components/Cart";

// manages state of currentCategory, passed to ProductList as a prop
// instructs which category's products should be retrieved
const Home = () => {
  // const [currentCategory, setCategory] = useState("");

  return (
    <div className="container">
      {/* to set currentCatgory, setCategory callback fx passed to CategoryMenu component as prop */}
      {/* to be executed on new category pick */}

      {/* <CategoryMenu setCategory={setCategory} />
      <ProductList currentCategory={currentCategory} /> */}
      {/* remove previous state management because now managed globally */}
      <CategoryMenu />
      <ProductList />
      <Cart />
    </div>
  );
};

export default Home;
