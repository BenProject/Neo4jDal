import { Entity, Relation } from "./Dal/types";
import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";

let dbWrapper = new Neo4j("bolt://localhost", "neo4j", "123456");
dbWrapper
      .createEntity(
        new Entity(uuid(), "Person", { age: 50, name: "ben" }, [
          new Relation(
            "dff21f54-16df-4fea-8bf7-3b18edd5787d",
            "sonOf",
            true,
            false,
            uuid()
          ),
        ])
      )
      .then((res) => console.log("isSucceedd ", res))
      .catch((err) => console.log(err));

  // dbWrapper
  //   .deleteById("dab5e584-2dc8-46a1-9c52-b7ca8dbe5ba4")
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));
//   .getEntityById("dff21f54-16df-4fea-8bf7-3b18edd5787d")
//   .then((entity) => console.log(entity))
//   .catch((err) => console.log(err));
