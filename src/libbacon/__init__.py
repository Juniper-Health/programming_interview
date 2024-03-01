from __future__ import annotations
from dataclasses import dataclass
import sqlite3
from queue import Queue

con = sqlite3.connect("database.db")
db = con.cursor()

@dataclass
class Node:
    actor_id: int
    parent: Node | None

def movies_starring_bacon_and(actor_name: str) -> list[str]:
    actor_id = _get_actor_id_by_name(actor_name)
    if actor_id is None:
        raise Exception(f"Could not find actor with name {actor_name}")
    bacon_id = _get_actor_id_by_name("Kevin Bacon")
    if bacon_id is None:
        raise Exception(f"Kevin Bacon is not in the database!")

    role_map = _get_movie_ids_by_actor_ids([actor_id, bacon_id])
    both_starred_in_movie_ids = [movie_id for movie_id in role_map[bacon_id] if movie_id in role_map[actor_id]]
    movie_names: list[str] = []
    for movie_id in both_starred_in_movie_ids:
        movie_names.append(_get_movie_name_by_id(movie_id))

    return movie_names


def did_bacon_work_with(actor_name: str):
    actor_id = _get_actor_id_by_name(actor_name)
    if actor_id is None:
        raise Exception(f"Could not find actor with name {actor_name}")
    bacon_id = _get_actor_id_by_name("Kevin Bacon")
    if bacon_id is None:
        raise Exception(f"Kevin Bacon is not in the database!")
    costar_ids = _get_actor_costar_ids(actor_id)
    return bacon_id in costar_ids

def bacon_number(actor_name: str) -> int | None:
    actor_id = _get_actor_id_by_name(actor_name)
    if actor_id is None:
        raise Exception(f"Could not find actor with name {actor_name}")
    bacon_id = _get_actor_id_by_name("Kevin Bacon")
    if bacon_id is None:
        raise Exception(f"Kevin Bacon is not in the database!")

    search_queue: Queue[Node] = Queue()
    search_queue.put(Node(actor_id=actor_id, parent=None))

    while not search_queue.empty():
        current = search_queue.get()
        if current.actor_id == bacon_id:
            n = 1
            while current.parent is not None:
                n += 1
                current = current.parent
            return n
        costar_ids = _get_actor_costar_ids(current.actor_id)
        for costar_id in costar_ids:
            search_queue.put(Node(actor_id=costar_id, parent=current))
            if costar_id == bacon_id:
                n = 1
                while current.parent is not None:
                    n += 1
                    current = current.parent
                return n
    return None


def _get_actor_costar_ids(actor_id: int) -> list[int]:
    query = """
    select actor_id from roles 
    where movie_id in (
        select movie_id from roles
        where actor_id = :actor_id
    ) and actor_id != :actor_id
    """
    actor_ids = db.execute(query, dict(actor_id=actor_id)).fetchall()
    return [row[0] for row in actor_ids] or []

def _get_actor_id_by_name(actor_name: str) -> int | None:
    query = """
    select id from actors 
    where upper(name) like :actor_name
    """
    ids = db.execute(query, dict(actor_name=actor_name.upper())).fetchone()
    return ids[0] if ids is not None else None

def _get_movie_name_by_id(movie_id: int) -> str | None:
    query = """
    select name from movies
    where id = :movie_id
    """
    row = db.execute(query, dict(movie_id=movie_id)).fetchone()
    return row[0] if row is not None else None

def _get_movie_ids_by_actor_ids(actor_id_list: list[int]) -> dict[int, list[int]]:
    """Returns a dict of { actor_id: list[movie_id] }"""
    # I should use parameter binding here but sqlite3 doesn't support binding lists
    id_str = ",".join([str(id) for id in actor_id_list])
    query = f"""
    select actor_id, movie_id from roles where actor_id in ({id_str})
    """
    rows = db.execute(query).fetchall()
    output: dict[int, list[int]] = {k: [] for k in actor_id_list}
    for row in rows:
        output[row[0]].append(row[1])
    return output

