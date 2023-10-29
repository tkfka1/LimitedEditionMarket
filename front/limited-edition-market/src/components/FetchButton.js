import React, { useState } from 'react';

function FetchButton() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/simple');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>
        Fetch Data
      </button>
      {loading && <div>Loading...</div>}
      {data && <div>{JSON.stringify(data)}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default FetchButton;
