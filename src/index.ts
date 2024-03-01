import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Queue } from 'queue-typescript'

async function getDb () {
  return open({
    filename: 'database.db',
    driver: sqlite3.Database
  })
}

interface Node {
  actorId: number
  parent: Node | null
}

export async function moviesStarringBaconAnd(actorName: string): Promise<string[]> {
  const actorId = await getActorIdByName(actorName);
  if (!actorId) {
    throw `Could not find actor with name ${actorName}`;
  }
  const baconId = await getActorIdByName("Kevin Bacon");
  if (!baconId) {
    throw `Kevin Bacon is not in the database!`;
  }
  const roleMap = await getMovieIdsByActorIds([actorId, baconId]);
  const bothStarredInMovieIds = roleMap[baconId].filter(movieId => roleMap[actorId].includes(movieId));
  const movieNames = (await Promise.all(bothStarredInMovieIds.map(async movieId => (await getMovieNameById(movieId)))))
  return movieNames.reduce((prev: string[], movieName) => { if (!!movieName) { prev.push(movieName)} return prev; }, []);
} 

export async function didBaconWorkWith(actorName: string): Promise<boolean> {
  const actorId = await getActorIdByName(actorName);
  if (!actorId) {
    throw `Could not find actor with name ${actorName}`;
  }
  const baconId = await getActorIdByName("Kevin Bacon");
  if (!baconId) {
    throw `Kevin Bacon is not in the database!`;
  }
  const costarIds = await getActorCostarIds(actorId);
  return costarIds.includes(baconId);
}

export async function baconNumber(actorName: string): Promise<number | null> {
  const actorId = await getActorIdByName(actorName);
  if (!actorId) {
    throw `Could not find actor with name ${actorName}`;
  }
  const baconId = await getActorIdByName("Kevin Bacon");
  if (!baconId) {
    throw `Kevin Bacon is not in the database!`;
  }

  if (actorId == baconId) { 
    return 0; 
  }

  const searchQueue = new Queue<Node>();
  searchQueue.enqueue({ actorId, parent: null });

  while (searchQueue.length > 0) {
    let current = searchQueue.dequeue();
    const costarIds = await getActorCostarIds(current.actorId);
    for (let costarId of costarIds){
      searchQueue.enqueue({actorId: costarId, parent:current})
      if (costarId == baconId) {
        let n = 1;
        while (current.parent) {
          n += 1;
          current = current.parent
        }
        return n;
      }
    }
  }
  return null;
}

async function getActorCostarIds (actorId: number): Promise<number[]> {
  const db = await getDb();
  const query = `
    select actor_id from roles 
    where movie_id in (
        select movie_id from roles
        where actor_id = :actorId
    ) and actor_id != :actorId`;
  const rows = await db.all(query, { ':actorId': actorId});
  return rows.map(({actor_id}) => actor_id)
}

async function getActorIdByName(actorName: string): Promise<number | null> {
  const db = await getDb();
  const query = `select id from actors where upper(name) like :actorName`;
  const row = await db.get(query, {':actorName': actorName})
  return row?.id
}

async function getMovieNameById(movieId: number): Promise<string | null> {
  const db = await getDb();
  const query = `select name from movies where id = :movieId`;
  const row= await db.get(query, {':movieId': movieId})
  return row?.name
}

/** Returns a map of all movie ids for each actor id  */
async function getMovieIdsByActorIds (actorIdList: number[]): Promise<{ [key: number]: number[] }> {
  const db = await getDb();
  // this should use parameter binding but sqlite does not support it
  const query = `select actor_id, movie_id from roles where actor_id in (${actorIdList.join(",")})`
  const rows: {actor_id: number, movie_id: number}[] = await db.all(query) ?? [];
  const return_map:{ [key: number]: number[]} = {};
  return rows.reduce((map, row) => { 
    map[row.actor_id] ??= [];
    map[row.actor_id].push(row.movie_id)
    return map
  },return_map);
}

