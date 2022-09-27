import { buildServer } from "@lute/shared";
import { Router } from "express";
import { buildFileController } from "./file-controller";
import { multerStorage } from "./storage";
import { ServerContext } from "./ServerContext";
import { logger } from "./logger";

export const startServer = buildServer<ServerContext>({
  name: "file-server",
  buildRouter(serverContext: ServerContext) {
    const fileController = buildFileController(serverContext);

    return Router()
      .post("/", multerStorage.single("file"), fileController.uploadFile)
      .get("/exists", fileController.getDoesFileExist)
      .get("/:id", fileController.getFile)
      .delete("/:id", fileController.deleteFile);
  },
  logger,
});