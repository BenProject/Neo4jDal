import "reflect-metadata";
import { createOutputRouter } from "./OutputListener/Graphql";
import Config from "../Config";
import * as express from "express";
import { createInputRouter } from "./InputListener/Rest";
import * as bodyParser from "body-parser";


async function run() {
  const outputListener = await createOutputRouter();
  const inputListener = await createInputRouter();
  const app = express();
  app.use(bodyParser.json())
  app.use("/output", outputListener);
  app.use("/input", inputListener);
  app.listen(Config.listenerPort);
}

run().then((res) => console.log("listening"));
