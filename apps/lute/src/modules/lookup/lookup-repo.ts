import { RedisClient } from "../../lib";
import {
  LookupKey,
  PutLookupPayload,
  Lookup,
  LookupStatus,
  hashLookupKey,
} from "@lute/domain";

export const buildLookupRepo = (redisClient: RedisClient) => ({
  async getLookup(key: LookupKey): Promise<Lookup> {
    const keyHash = hashLookupKey(key);
    const lookup = await redisClient.get(`lookup:${keyHash}`);
    return lookup ? JSON.parse(lookup) : null;
  },
  async createLookup(key: LookupKey): Promise<Lookup> {
    const keyHash = hashLookupKey(key);
    const lookup: Lookup = {
      key,
      keyHash,
      status: LookupStatus.Started,
    };
    await redisClient.set(`lookup:${keyHash}`, JSON.stringify(lookup));
    return lookup;
  },
  async getOrCreateLookup(key: LookupKey): Promise<Lookup> {
    const lookup = await this.getLookup(key);
    if (lookup) {
      return lookup;
    }
    return this.createLookup(key);
  },
  async getLookupByHash(keyHash: string): Promise<Lookup> {
    const lookup = await redisClient.get(`lookup:${keyHash}`);
    return lookup ? JSON.parse(lookup) : null;
  },
  async putLookup(keyHash: string, payload: PutLookupPayload): Promise<Lookup> {
    const lookup = await redisClient.get(`lookup:${keyHash}`);
    if (!lookup) {
      throw new Error(`Lookup not found for key hash ${keyHash}`);
    }
    const parsedLookup = JSON.parse(lookup);
    const newLookup: Lookup = {
      ...parsedLookup,
      error: undefined,
      ...payload,
      bestMatch: {
        ...parsedLookup.bestMatch,
        ...payload.bestMatch,
      },
    };
    await redisClient.set(`lookup:${keyHash}`, JSON.stringify(newLookup));
    return newLookup;
  },
  async deleteLookup(keyHash: string): Promise<void> {
    await redisClient.del(`lookup:${keyHash}`);
  },
});

export type LookupRepo = ReturnType<typeof buildLookupRepo>;
