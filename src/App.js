import { useState } from "react";
import "./App.css";

function App() {
  const [countryInput, setInput] = useState("");
  const [countryMatches, setCountryMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoint =
    "http://api.countrylayer.com/v2/all?access_key=b6a55d2815e6cc572f69b644c336f22e";

  const formatInput = (inputParam) => {
    inputParam = inputParam.replace(" ", "");
    inputParam = inputParam.replace(new RegExp("\r?\n", "g"), ",");

    return inputParam;
  };

  const convertInputToCountryArray = (inputParam) => {
    let arr = inputParam.split(",");
    if (arr.length > 0) {
      let lastElement = arr[arr.length - 1].trim();
      if (lastElement === "") {
        arr.pop();
      }
    }
    return arr;
  };

  const isValidInput = (countryInput) => {
    return countryInput.trim() !== "" && countryInput.length > 2;
  };

  const fetchData = () => {
    setLoading(true);
    if (isValidInput(countryInput)) {
      let inputCountryList;

      let formattedInput = formatInput(countryInput);

      inputCountryList = convertInputToCountryArray(formattedInput);

      console.log(inputCountryList);

      fetch(endpoint)
        .then((res) => res.json())
        .then((response) => {
          let results = [];
          for (let i = 0; i < inputCountryList.length; i++) {
            const countryFromInputList = inputCountryList[i];
            for (let j = 0; j < response.length; j++) {
              let countryFromResponse = response[j];
              if (
                countryFromInputList === countryFromResponse.name ||
                countryFromInputList === countryFromResponse.nativeName
              ) {
                results.push(countryFromResponse);
              }
            }
          }

          setLoading(false);
          setCountryMatches(results);
        });
    } else {
      setLoading(false);
    }
  };

  const handleChange = (evt) => {
    const val = evt.target.value;
    setInput(val);
  };

  return (
    <div className="App">
      <h1> Country Manager </h1>

      <textarea rows="10" onChange={handleChange} />

      <button disabled={loading} onClick={fetchData}>
        {loading ? "Loading..." : "Load"}
      </button>

      {countryMatches.length > 0 ? (
        <>
          <h2> Search Results </h2>
          <div className="search-results">
            <table>
              <thead>
                <tr>
                  <th> Name </th>
                  <th className="iso-country-code"> Iso Country Code</th>
                </tr>
              </thead>
              <tbody>
                {countryMatches.map((country) => {
                  return (
                    <tr>
                      <td>{country.name} </td>
                      <td className="iso-country-code">{country.alpha2Code}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
