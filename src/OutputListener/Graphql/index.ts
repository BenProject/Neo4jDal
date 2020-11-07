import * as express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import EntityResolver from "./Resolvers/EntityResolver";
import RelationResolver from "./Resolvers/RelationResolver";

const router = express.Router();

export async function createListenerRouter() {
  const schema = await buildSchema({
    resolvers: [EntityResolver, RelationResolver],
  });

  router.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );

  return Promise.resolve(router);
}
