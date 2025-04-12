import React, { useEffect, useState } from 'react';
import Flag from '../components/Flag';  // Ensure the correct path

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://countries-api-abhishek.vercel.app/countries')
      .then(res => res.json())
      .then(data => setCountries(data.data)); // Access 'data' field
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Find the closest matching country based on partial search
  const matchedCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If there are matched countries, use the first match or fallback to default country
  const country = matchedCountries.length > 0
    ? matchedCountries[0] // Show the closest match based on the search input
    : countries.find(c => c.name === 'Afghanistan'); // Default to Afghanistan if no match

  return (
    <div>
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
            maxWidth: '500px', // Set the max width for the input
            margin: '0 auto',  // Center the input horizontally
            display: 'block'   // Ensure the element is block-level for centering
          }}
      />
      {country ? (
        <div>
          <h3 className="text-center">{country.name}</h3>
          <Flag flag={country.flag} name={country.name} />
          <div className="row">
            {/* First Column */}
            <div className="col-md-6">
              <ul className="list-group my-3">
                <li className="list-group-item"><strong>Capital:</strong> {country.capital}</li>
                <li className="list-group-item"><strong>Region:</strong> {country.region}</li>
                <li className="list-group-item"><strong>Subregion:</strong> {country.subregion}</li>
                <li className="list-group-item"><strong>Population:</strong> {country.population.toLocaleString()}</li>
                <li className="list-group-item"><strong>Area:</strong> {country.area.toLocaleString()} km²</li>
              </ul>
            </div>

            {/* Second Column */}
            <div className="col-md-6">
              <ul className="list-group my-3">
                <li className="list-group-item">
                  <strong>Coordinates:</strong> {country.coordinates.latitude}, {country.coordinates.longitude}
                </li>
                <li className="list-group-item"><strong>Timezones:</strong> {country.timezones.join(', ')}</li>
                <li className="list-group-item"><strong>Currency:</strong> {country.currency}</li>
                <li className="list-group-item"><strong>Languages:</strong> {country.languages.join(', ')}</li>

                {/* Insert borders in the same list */}
                {country.borders && country.borders.length > 0 && (
                  <li className="list-group-item">
                    <strong>Border Countries: </strong>
                    {country.borders
                      .map((border, index) => (
                        <span key={index}>
                          <button
                            onClick={() => setSearchTerm(border)}  // Set search term to the border country
                            className="btn btn-link text-decoration-none text-primary"
                            style={{ background: 'none', border: 'none', padding: '0' }} // Remove button styles to make it look like a link
                          >
                            {border}
                          </button>
                          {/* Add a comma if it's not the last item */}
                          {index < country.borders.length - 1 && ', '}
                        </span>
                      ))}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>No country found or loading...</p>
      )}
    </div>
  );
};

export default Home;
