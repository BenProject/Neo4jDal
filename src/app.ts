import "reflect-metadata";
import { createListenerRouter } from "./OutputListener/Graphql";
import Config from "../Config";
import * as express from "express";

async function run() {
  const listenerRouter = await createListenerRouter();
  const app = express();
  app.use("", listenerRouter);
  app.listen(Config.listenerPort);
}

run().then((res) => console.log("listening"));
