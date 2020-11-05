import { Entity, EntityRelationsPair, Relation } from "./Dal/types";
import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";

let dbWrapper = new Neo4j("bolt://localhost", "neo4j", "123456");
dbWrapper
  // .createEntity(
  //   new EntityRelationsPair(new Entity("Person", { age: 5, name: "dana" }), [
  //     new Relation("momOf","8","9","8"),
  //   ])
  // )
  // .then((res) => console.log("isSucceedd ", res))
  // .catch((err) => console.log(err));

  // .deleteById("6")
  // .then((res) => console.log(res))
  // .catch((err) => console.log(err));
  // .getEntityById("13")
  // .then((entity) => console.log(entity))
  // .catch((err) => console.log(err));
  // .getEntityRelationsById("8", 2, null)
  // .then((res) => res.map(pair=>console.log(pair.Relations)))
  // .catch((err) => console.log(err));
  .getEntitiesByParams({ age: 50})
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
