import "reflect-metadata";
import { createOutputRouter } from "./OutputListener/Graphql";
import Config from "../Config";
import * as express from "express";
import { createInputRouter } from "./InputListener/Rest";
import * as bodyParser from "body-parser";


async function run() {
  const outputListener = await createOutputRouter("/output");
  const inputListener = await createInputRouter("/input");
  const app = express();
  app.use(bodyParser.json())
  app.use("", outputListener);
  app.use("", inputListener);
  app.listen(Config.listenerPort);
}

run().then((res) => console.log("listening"));
