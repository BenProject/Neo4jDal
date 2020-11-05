import { Field, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export default class Entity {
  @Field((type) => String)
  public EntityType: string;

  @Field((type) => GraphQLJSONObject)
  public Properties: Object;

  private _id: string;
  constructor(
    entityType: string,
    properties: Object,
    id: string | null = null
  ) {
    this.EntityType = entityType;
    this.Properties = properties;
    this._id = id;
  }

  get Id() {
    return this._id;
  }
}
