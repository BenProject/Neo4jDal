import EntityRouter from "./Routers/Entity";
import * as express from "express";

const router = express.Router();

export async function createInputRouter() {
  router.use(`/entity`, EntityRouter);

  return Promise.resolve(router);
}
