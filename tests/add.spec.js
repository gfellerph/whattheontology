const server = require('./server/server');
const dict = require('./server/ontology-dictionary');

describe('sample', () => {
  it('should pass', () => {
    Object.values(dict).map((ont) => {
      server.inject({
        method: 'POST',
        url: '/schema',
        data: {
          url: ont.resource,
        }
      })
    })
  });
});
