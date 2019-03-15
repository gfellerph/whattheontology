const dict = require('./server/ontology-dictionary');
const fetch = require('node-fetch');

const keys = Object.keys(dict);
const mapper = async () => {
  for (key of keys) {
    const response = await fetch('http://127.0.0.1:3000/schema', {
      method: 'POST',
      body: JSON.stringify({
        url: dict[key].resource,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(dict[key].title, ' indexed', response.statusText);
  }
}
mapper();
