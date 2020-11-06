import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";
import { listener } from "./OutputListener/Graphql";
import { dbWrapper } from "./bootstrapper";
import EntityRelationsPair from "./Dal/Pair/EntityRelationsPair";
import Entity, { entityProperties } from "./Dal/Entity";
import Relation from "./Dal/Relation";
import Id from "./Dal/Id";

dbWrapper
// .createEntity(
//   new EntityRelationsPair(
//     new Entity("Person", new entityProperties({ name: "newName", age: 120 })),
//     [new Relation("randomRelation", "12", null, "12")]
//   )
// )
// .deleteById(new Id("13"))
// .then(res=>console.log(res))
// .catch(err=>console.log(err))
// .getEntityRelationsById(new Id("11"),2,null)
// .then(res=>console.log(res))
.getNumberOfPages(new entityProperties({}),5)
.then(res=>console.log(res))
listener().then((res) => console.log("success"));
