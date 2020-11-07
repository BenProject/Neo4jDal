import EntityRouter from "./Routers/Entity";
import * as express from "express";

const router = express.Router();

export async function createInputRouter(rootPath: string) {
  router.use(`${rootPath}/entity`, EntityRouter);

  return Promise.resolve(router);
}
