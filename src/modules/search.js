const search = async (query) => {
  const raw = await fetch('/search', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    })
  });
  const response = await raw.json();
  return response.hits.hits;
}

export default search;
