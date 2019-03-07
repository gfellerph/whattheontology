import elasticsearch from 'elasticsearch-browser';

const client = new elasticsearch.Client({
  host: 'https://whattheontology-9285030012.us-east-1.bonsaisearch.net'
});

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
