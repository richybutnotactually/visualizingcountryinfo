import React, { useEffect, useState } from "react";
import Flag from "../components/Flag";

const filterOptions = [
  "All",
  "Asia",
  "Europe",
  "Africa",
  "PopOver50M",
  "PopUnder1M",
];

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch("https://countries-api-abhishek.vercel.app/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.data));
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterSelect = (option) => {
    setFilterOption(option);
    setShowDropdown(false);
  };

  const filteredCountries = countries
    .filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((country) => {
      if (filterOption === "All") return true;
      if (filterOption === "Asia") return country.region === "Asia";
      if (filterOption === "Europe") return country.region === "Europe";
      if (filterOption === "Africa") return country.region === "Africa";
      if (filterOption === "PopOver50M") return country.population > 50000000;
      if (filterOption === "PopUnder1M") return country.population < 1000000;
      return true;
    });

  const country =
    filteredCountries.length > 0
      ? filteredCountries[0]
      : countries.find((c) => c.name === "Afghanistan");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Blurred Flag Background */}
      {country && (
        <img
          src={country.flag}
          alt={`${country.name} flag`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            filter: "blur(12px)",
            opacity: 0.2,
            zIndex: -1,
          }}
        />
      )}

      {/* Main Content */}
      <div className="container py-1">
        {/* Search & Filter */}
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            maxWidth: "600px",
            marginInline: "auto",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <div style={{ position: "relative", flex: "0 0 200px" }}>
            <div
              className="form-control d-flex justify-content-between align-items-center"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: "pointer" }}
            >
              {filterOption === "PopOver50M"
                ? "Population > 50M"
                : filterOption === "PopUnder1M"
                ? "Population < 1M"
                : filterOption}
              <span style={{ marginLeft: "auto" }}>▼</span>
            </div>

            {showDropdown && (
              <ul
                className="list-group shadow border bg-white mt-1"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 5,
                  maxHeight: "none",
                  overflowY: "visible",
                }}
              >
                {filterOptions.map((opt) => (
                  <li
                    key={opt}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleFilterSelect(opt)}
                    style={{ cursor: "pointer" }}
                  >
                    {opt === "PopOver50M"
                      ? "Population > 50M"
                      : opt === "PopUnder1M"
                      ? "Population < 1M"
                      : opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Country Details */}
        {country ? (
          <div>
            <h3 className="text-center">{country.name}</h3>
            <Flag flag={country.flag} name={country.name} />
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group my-3">
                  <li className="list-group-item">
                    <strong>Capital:</strong> {country.capital}
                  </li>
                  <li className="list-group-item">
                    <strong>Region:</strong> {country.region}
                  </li>
                  <li className="list-group-item">
                    <strong>Subregion:</strong> {country.subregion}
                  </li>
                  <li className="list-group-item">
                    <strong>Population:</strong>{" "}
                    {country.population.toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Area:</strong> {country.area.toLocaleString()} km²
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group my-3">
                  <li className="list-group-item">
                    <strong>Coordinates:</strong>{" "}
                    {country.coordinates.latitude},{" "}
                    {country.coordinates.longitude}
                  </li>
                  <li className="list-group-item">
                    <strong>Timezones:</strong> {country.timezones.join(", ")}
                  </li>
                  <li className="list-group-item">
                    <strong>Currency:</strong> {country.currency}
                  </li>
                  <li className="list-group-item">
                    <strong>Languages:</strong> {country.languages.join(", ")}
                  </li>
                  {country.borders && country.borders.length > 0 && (
                    <li className="list-group-item">
                      <strong>Border Countries: </strong>
                      {country.borders.map((border, index) => (
                        <span key={index}>
                          <button
                            onClick={() => setSearchTerm(border)}
                            className="btn btn-link text-decoration-none text-primary"
                            style={{
                              background: "none",
                              border: "none",
                              padding: "0",
                            }}
                          >
                            {border}
                          </button>
                          {index < country.borders.length - 1 && ", "}
                        </span>
                      ))}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">No country found or loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
