import React, { useState } from 'react';
import axios from 'axios';

const PixabaySearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`https://pixabay.com/api/?key=42728743-f9b97c338a088fe6b5c09b9bf&q=${encodeURIComponent(query)}&image_type=photo`);
        setResults(response.data.hits);
      } catch (error) {
        setError(error);
      }
  
      setIsLoading(false);
    };
  
    return (
      <div>
        <h2>Pixabay Image Search</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search for yellow flowers..." 
          />
          <button type="submit">Search</button>
        </form>
  
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
  
        <div>
          {results.map(result => (
            <div key={result.id}>
              <img src={result.previewURL} alt={result.tags} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PixabaySearch;