import { useState } from "react";
import Autosuggest from "react-autosuggest";
import PropTypes from "prop-types";

const AutoSuggestInput = ({
  data,
  name,
  placeholder,
  value = "",
  setValue,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0
      ? data
      : data.filter(
          (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input based on the clicked suggestion. Teach Autosuggest how to calculate the input value for every given suggestion.
  const getSuggestionValue = (suggestion) => suggestion.name;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion) => (
    <div className="px-3 py-1.5 hover:bg-gray-800 text-white cursor-pointer ">
      {suggestion.name}
    </div>
  );

  // handle input change
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Render the suggestions container
  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <div
      {...containerProps}
      className={`z-10 bg-gray-500 rounded w-full mb-5 ${
        children && "h-auto"
      } overflow-hidden overflow-y-auto`}
    >
    
      {children}
    </div>
  );

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: placeholder,
    value: value,
    name: name,
    onChange: onChange,
    className: "border border-gray-700 p-2 rounded w-full outline-none",
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderSuggestionsContainer={renderSuggestionsContainer}
    />
  );
};
AutoSuggestInput.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
export default AutoSuggestInput;
