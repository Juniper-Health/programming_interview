# libbacon

A library for all your bacon needs.

## Usage

```python
# list actors that appeared with any other actor
did_bacon_work_with("Miranda Cosgrove");
# -> False
did_bacon_work_with("Frankie Muniz");
# -> True

# calculates the input name's degrees of separation from Kevin Bacon
bacon_number("Sigourney Weaver")
# -> 2

# lists all movies starring an actor and Kevin Bacon
movies_starring_bacon_and("Frankie Muniz")
# -> ['My Dog Skip']
```

## Tests

Libbacon uses [pytest](https://pypi.org/project/pytest/)
```
pytest src/test
```

## Dependencies

This library supports Python 3.9 and above and dependencies can be installed with:
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## The Database

The database can be explored via sqlite:
```
sqlite3 database.db
# to show the schema:
> .schema
```
