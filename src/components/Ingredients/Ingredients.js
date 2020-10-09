import React, { useCallback, useEffect, useMemo, useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useApi from "../../hooks/apiCalls";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const {
    isLoading,
    data,
    error,
    fetchData,
    reqIdentifier,
    clearError,
  } = useApi();

  useEffect(() => {
    if (data && reqIdentifier === "REMOVE_INGREDIENT") {
      if (!data.hasOwnProperty("title")) {
        setIngredients((prevState) =>
          prevState.filter((ingredient) => ingredient.id !== data.id)
        );
      }
    }
    if (data && reqIdentifier === "ADD_INGREDIENT") {
      if (data.hasOwnProperty("title")) {
        setIngredients((prevState) => [...prevState, data]);
      }
    }
  }, [data, reqIdentifier]);

  const addIngredientHandler = useCallback(
    (item) => {
      fetchData(
        "https://react-hook-example-app.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(item),
        item,
        "ADD_INGREDIENT"
      );
    },
    [fetchData]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      fetchData(
        `https://react-hook-example-app.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "REMOVE_INGREDIENT"
      );
    },
    [fetchData]
  );

  const searchIngredientsHandler = useCallback((ingredients) => {
    setIngredients(ingredients);
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={(id) => {
          removeIngredientHandler(id);
        }}
      />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddItem={addIngredientHandler}
        onLoadingIngredients={isLoading}
      />
      <section>
        <Search onIngredientsSearch={searchIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
