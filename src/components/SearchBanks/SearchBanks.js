import React, { useState, useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { WidgetContext } from "../../WidgetContext";
import { selectBankSelection } from "../../selectors";
import { GoSearch } from "react-icons/go";
import "../../css/payper-style.css";

const SearchBanks = () => {
  const {
    state,
    actions: { searchForBank },
  } = useContext(WidgetContext);

  const bankSelection = selectBankSelection(state);

  const [inputValue, setInputValue] = useState("");

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    
    let result =
      inputLength === 0
        ? []
        : state.banks.filter(
            (bank) =>
              bank.bank_name.toLowerCase().includes(inputValue) ||
              bank.shortName.toLowerCase().includes(inputValue)
          );

    searchForBank(result);
  };

  useEffect(() => {
    getSuggestions(inputValue);
  }, [inputValue]);

  const searchLabel = (
    <p className="search-label">
      search your bank <sub><GoSearch /></sub>
    </p>
  );

  return (
    <div className="search-section" >
      <TextField
        className="search-field"
        id="standard-basic"
        label={searchLabel}
        variant="standard"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBanks;
