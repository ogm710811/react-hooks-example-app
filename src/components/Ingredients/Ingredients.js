import React, { useCallback, useEffect, useMemo, useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoadingIngredients, setLoadingIngredients] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    console.log("RENDERING INGREDIENTS");
  }, [ingredients]);

  const addIngredientHandler = useCallback((item) => {
    setLoadingIngredients(true);
    fetch("https://react-hook-example-app.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setLoadingIngredients(false);
        return response.json();
      })
      .then((resData) => {
        setIngredients((prevState) => [
          ...prevState,
          { ...item, id: resData.name },
        ]);
      })
      .catch((error) => {
        setLoadingIngredients(false);
        setErrorMessage(error.message);
      });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    setLoadingIngredients(true);
    fetch(
      `https://react-hook-example-app.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setLoadingIngredients(false);
        setIngredients((prevState) =>
          prevState.filter((ingredient) => ingredient.id !== id)
        );
      })
      .catch((error) => {
        setLoadingIngredients(false);
        setErrorMessage(error.message);
      });
  }, []);

  const searchIngredientsHandler = useCallback((ingredients) => {
    setIngredients(ingredients);
  }, []);

  const clearErrorHandler = () => {
    setErrorMessage(null);
  };

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
      {errorMessage && (
        <ErrorModal onClose={clearErrorHandler}>{errorMessage}</ErrorModal>
      )}
      <IngredientForm
        onAddItem={addIngredientHandler}
        onLoadingIngredients={isLoadingIngredients}
      />
      <section>
        <Search onIngredientsSearch={searchIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
