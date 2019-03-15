const fetch = require('node-fetch');

module.exports = async (url) => {
  const raw = await fetch(`https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/info?vocab=${url}`);
  return raw.json();
}