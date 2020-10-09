import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";
import useApi from "../../hooks/apiCalls";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(({ onIngredientsSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef();
  const { isLoading, data, fetchData, error, clearError } = useApi();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === searchInputRef.current.value) {
        const queryParams =
          searchInput.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchInput}"`;

        fetchData(
          "https://react-hook-example-app.firebaseio.com/ingredients.json" +
            queryParams,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, fetchData, searchInputRef]);

  useEffect(() => {
    if (data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onIngredientsSearch(loadedIngredients);
    }
  }, [data, onIngredientsSearch]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Is loading ...</span>}
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
