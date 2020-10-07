import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(({ onIngredientsSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef();

  const fetchIngredients = async (queryParams) => {
    const response = await fetch(
      "https://react-hook-example-app.firebaseio.com/ingredients.json" +
        queryParams
    );
    const data = await response.json();
    return data;
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === searchInputRef.current.value) {
        const searchedIngredients = [];
        const queryParams =
          searchInput.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchInput}"`;
        fetchIngredients(queryParams).then((serverData) => {
          for (const key in serverData) {
            searchedIngredients.push({
              id: key,
              title: serverData[key].title,
              amount: serverData[key].amount,
            });
          }
          onIngredientsSearch(searchedIngredients);
        });
      }
    }, 500);
    return () => {
      clearTimeout(timer)
    }
  }, [searchInput, onIngredientsSearch, searchInputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
