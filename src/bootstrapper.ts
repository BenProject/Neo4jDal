import Config from "../Config";
import Neo4j from "./DB/Neo4j";

export const dbWrapper = new Neo4j(
  Config.Ne4oj.address,
  Config.Ne4oj.username,
  Config.Ne4oj.password
);
