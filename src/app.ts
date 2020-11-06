import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";
import { listener } from "./OutputListener/Graphql";
import { dbWrapper } from "./bootstrapper";
import EntityRelationsPair from "./Dal/Pair/EntityRelationsPair";
import Entity, { entityProperties } from "./Dal/Entity";
import Relation from "./Dal/Relation";

dbWrapper.createEntity(
  new EntityRelationsPair(
    new Entity("Person", new entityProperties({ name: "newName", age: 120 })),
    [new Relation("randomRelation", "12", null, "12")]
  )
).then(res=>console.log(res))
.catch(err=>console.log(err))

listener().then((res) => console.log("success"));
