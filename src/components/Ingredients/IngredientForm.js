import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(({ onAddItem, onLoadingIngredients }) => {
  const [titleInput, setTitleInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  console.log('RENDERING INGREDIENT FORM')

  const submitHandler = (event) => {
    event.preventDefault();
    onAddItem({ title: titleInput, amount: amountInput });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {onLoadingIngredients && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
