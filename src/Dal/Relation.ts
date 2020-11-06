import { GraphQLJSONObject } from "graphql-type-json";
import { Field, ObjectType } from "type-graphql";
import Id from "./Id";

@ObjectType()
export default class Relation {
  @Field((type) => String)
  public RelType: string;
  @Field((type) => Id)
  public RelEntityId: Id;
  @Field((type) => Id)
  public StartEntityId: Id | null;
  @Field((type) => Id)
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
