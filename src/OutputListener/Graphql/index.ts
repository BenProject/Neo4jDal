const express = require("express");
const { graphqlHTTP } = require("express-graphql");
import { buildSchema } from "type-graphql";
import Config from "../../../Config";
import EntityResolver from "./Resolvers/EntityResolver";

const app = express();
export async function listener() {
  const schema = await buildSchema({
    resolvers: [EntityResolver],
    validate: false
  });

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );

  app.listen(Config.listenerPort);
}
