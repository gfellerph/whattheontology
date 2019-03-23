const rdflib = require('rdflib');

module.exports = async (url) => {
  return new Promise((resolve, reject) => {
    const store = rdflib.graph();
    const fetcher = new rdflib.Fetcher(store, 5000);
    fetcher.nowOrWhenFetched(url, (ok, body, xhr) => {
      if (!ok) return reject(new Error(body));
      resolve(store);
    });
  });
}