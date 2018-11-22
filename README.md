# whattheontology

https://whattheontology.herokuapp.com/

A search engine for RDF namespaces, properties, classes, ontologies and datatypes recommended by the SOLID project (https://github.com/solid/solid-ui/blob/master/src/ns.js).

For a list of supported namespaces, see the [ontology dictionary](https://github.com/tuelsch/whattheontology/blob/master/server/ontology-dictionary.mjs). Fork this repo and create a pull request if you like to add another.

## Search engine
The search engine uses [lunr](https://lunrjs.com/) to search through indexable properties like `rdfs:label` or `rdfs:comment` (see [index file](https://github.com/tuelsch/whattheontology/blob/master/server/index.mjs) for a list of indexed fields). Lunr enables queries with:
- wildcards: `nam*`
- excludes: `name -first`
- field specific: `label:name`
- boosts: `first^10 name`
- fuzzy search: `fist~1 name`

The server is built with [fastify]() and hostet on [heroku]().

## Frontend
The frontend is a SPA built with [Vue]().

## TODO
This project is in alpha phase. Things may break and be slow, namespaces might be missing. If you like to help, take a look at the [issues](https://github.com/tuelsch/whattheontology/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Aenhancement) labelled with `enhancement`.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development (frontend)
```
yarn run serve
```

### Starts the server with nodemon
```
yarn run backend:dev
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```
