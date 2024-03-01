import {describe, expect, test} from '@jest/globals';
import { baconNumber, didBaconWorkWith, moviesStarringBaconAnd } from '../src';

describe('baconNumber', ()=>{
  test('generates correct bacon numbers',async ()=>{
    expect(await baconNumber("Frankie Muniz")).toBe(1);
    expect(await baconNumber("Sarah Jessica Parker")).toBe(1);

    expect(await baconNumber("Sigourney Weaver")).toBe(2);
    expect(await baconNumber("Miranda Cosgrove")).toBe(2);
  })
})

describe('didBaconWorkWith', ()=> {
  test('returns whether the actor worked with bacon', async()=>{
    expect(await didBaconWorkWith("Frankie Muniz")).toBe(true);
    expect(await didBaconWorkWith("Sarah Jessica Parker")).toBe(true);

    expect(await didBaconWorkWith("Sigourney Weaver")).toBe(false);
    expect(await didBaconWorkWith("Miranda Cosgrove")).toBe(false);
  })
})

describe('moviesStarringBaconAnd', ()=>{
  test('returns movies that costar the actor and bacon', async()=>{
    expect(await moviesStarringBaconAnd("Sigourney Weaver")).toHaveProperty('length', 0)
    expect(await moviesStarringBaconAnd("Miranda Cosgrove")).toHaveProperty('length', 0)

    expect(await moviesStarringBaconAnd("Frankie Muniz")).toHaveProperty('length', 1)
    expect(await moviesStarringBaconAnd("Sarah Jessica Parker")).toHaveProperty('length', 1)
  })
})
