import { ObjectType } from "type-graphql";
import Id from "./Id";

@ObjectType()
export default class Relation {
  public RelType: string;
  public RelEntityId: Id;
  public StartEntityId: Id | null;
  public EndEntityId: Id | null;

  constructor(
    relType: string,
    relEntityId: Id,
    start: Id = null,
    end: Id = null
  ) {
    this.RelType = relType;
    this.RelEntityId = relEntityId;
    this.StartEntityId = start;
    this.EndEntityId = end;
  }
}
