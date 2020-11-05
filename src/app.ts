import { Entity, EntityRelationsPair, Relation } from "./Dal/types";
import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";

let dbWrapper = new Neo4j("bolt://localhost", "neo4j", "123456");
dbWrapper
  // .createEntity(
  //   new EntityRelationsPair(new Entity("Person", { age: 5, name: "taltul" }), [
  //     new Relation("sonOf", "3", "3",null),
  //   ])
  // )
  // .then((res) => console.log("isSucceedd ", res))
  // .catch((err) => console.log(err));

  .deleteById("6")
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
//   .getEntityById("dff21f54-16df-4fea-8bf7-3b18edd5787d")
//   .then((entity) => console.log(entity))
//   .catch((err) => console.log(err));
// .getEntityRelationsById("dff21f54-16df-4fea-8bf7-3b18edd5787d", 3, null)
// .then((res) => console.log(res))
// .catch((err) => console.log(err));
