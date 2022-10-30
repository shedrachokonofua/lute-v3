import { MongoClient } from "mongodb";
import { config } from "./config";
import { buildRedisClient, buildLuteEventClient } from "./lib";
import { logger } from "./logger";
import { buildAlbumInteractor } from "./modules/albums";
import { buildChartInteractor } from "./modules/charts";
import { buildCrawlerInteractor } from "./modules/crawler";
import { buildFileInteractor, buildFileStorageClient } from "./modules/files";
import { buildLookupInteractor } from "./modules/lookup";
import { buildProfileInteractor } from "./modules/profile";
import { buildSpotifyInteractor } from "./modules/spotify";

export const buildContext = async () => {
  const mongoClient = new MongoClient(config.mongo.url);
  const redisClient = await buildRedisClient({
    logger,
    url: config.redis.url,
  });
  const fileStorageClient = buildFileStorageClient();
  const eventClient = buildLuteEventClient(redisClient);

  const albumInteractor = buildAlbumInteractor(mongoClient);
  const chartInteractor = buildChartInteractor({
    albumInteractor,
    mongoClient,
  });
  const crawlerInteractor = buildCrawlerInteractor(redisClient);
  const fileInteractor = buildFileInteractor({
    eventClient,
    redisClient,
    fileStorageClient,
  });
  const lookupInteractor = buildLookupInteractor({
    albumInteractor,
    crawlerInteractor,
    eventClient,
    redisClient,
  });
  const profileInteractor = buildProfileInteractor({
    mongoClient,
    albumInteractor,
  });
  const spotifyInteractor = buildSpotifyInteractor(redisClient);

  return {
    buildRedisClient: () => buildRedisClient({ logger, url: config.redis.url }),
    eventClient,
    fileStorageClient,
    mongoClient,
    redisClient,
    albumInteractor,
    chartInteractor,
    crawlerInteractor,
    fileInteractor,
    lookupInteractor,
    profileInteractor,
    spotifyInteractor,
  };
};

export type Context = Awaited<ReturnType<typeof buildContext>>;
