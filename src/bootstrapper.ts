import Config from "../Config";
import { IKickDBWrapper } from "./Dal/interfaces";
import Neo4j from "./DB/Neo4j";

export const dbWrapper: IKickDBWrapper = new Neo4j(
  Config.Ne4oj.address,
  Config.Ne4oj.username,
  Config.Ne4oj.password
);
