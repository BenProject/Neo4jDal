import { Entity, Relation } from "./Dal/types";
import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";

let dbWrapper = new Neo4j("bolt://localhost", "neo4j", "123456");
dbWrapper
  .createEntity(
    new Entity(uuid(), "Person", { age: 50, name: "iris" }, [
      new Relation(
        "7b6abdae-d75d-4d2a-b624-3be46280ae32",
        "motheOf",
        true,
        false,
        uuid()
      ),
    new Relation(
        "7b6abdae-d75d-4d2a-b624-3be46280ae32",
        "sonOf",
        false,
        true,
        uuid()
      ),
    ])
  )
  .then((res) => console.log("isSucceedd ", res))
  .catch((err) => console.log(err));
