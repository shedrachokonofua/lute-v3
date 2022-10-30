import { nanoid } from "nanoid";
import { RedisClient } from "../../lib";
import { config } from "../../config";
import { logger } from "../../logger";

export const buildFileRepo = (redisClient: RedisClient) => ({
  async saveFileName(name: string) {
    const id = nanoid();
    await redisClient.set(`file:${id}`, name);
    await redisClient.set(`file:name:${name}`, id, {
      EX: config.files.ttlSeconds,
    });
    logger.info({ id, name }, "Saved file name");

    return id;
  },

  async getFileName(id: string) {
    return redisClient.get(`file:${id}`);
  },

  async getFileId(name: string) {
    return redisClient.get(`file:name:${name}`);
  },

  async deleteFile(id: string) {
    const name = await redisClient.get(`file:${id}`);
    if (!name) {
      return;
    }
    await redisClient.del(`file:${id}`);
    await redisClient.del(`file:name:${name}`);
    logger.info({ id, name }, "Deleted file name");
  },
});
