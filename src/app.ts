import Neo4j from "./DB/Neo4j";
import { v4 as uuid } from "uuid";
import { listener } from "./OutputListener/Graphql";


listener().then((res) => console.log("success"));
