# libbacon

A library for all your bacon needs.

## Usage

```typescript
// list actors that appeared with any other actor
didBaconWorkWith("Miranda Cosgrove");
// -> False
didBaconWorkWith("Frankie Muniz");
// -> True

// calculates the input name's degrees of separation from Kevin Bacon
baconNumber("Sigourney Weaver")
// -> 2

// lists all movies starring an actor and Kevin Bacon
moviesStarringBaconAnd("Frankie Muniz")
// -> ['My Dog Skip']
```

## Tests

Libbacon uses [jest](https://www.npmjs.com/package/jest)
```
npm test
```

## Dependencies

This library supports all recent node versions  and dependencies can be installed with:
```
npm i
```

## The Database

The database can be explored via sqlite:
```
sqlite3 database.db
# to show the schema:
> .schema
```
