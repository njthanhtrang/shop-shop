import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from "../../utils/actions";
import { useStoreContext } from "../../utils/GlobalState";
import { idbPromise } from "../../utils/helpers";

function CategoryMenu() {
  // retrieve current state from GSO and dispatch method to update state
  const [state, dispatch] = useStoreContext();

  // destructure categories out of GSO
  const { categories } = state;

  // useQuery is async
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];

  useEffect(() => {
    // if categoryData not undefined/exists, or has changed from response of useQuery, run dispatch()
    if (categoryData) {
      // execute dispatch fx with action obj indicating type of action and data to set categories' state to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });

      categoryData.categories.forEach(category => {
        idbPromise("categories", "put", category);
      });
      
    } else if (!loading) {
      idbPromise("categories", "get").then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
