import { ArgsType, Field, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Id from "./Id";

@ArgsType()
export class entityProperties {
  @Field((type) => GraphQLJSONObject)
  public Params: Object;
  constructor(params: Object) {
    this.Params = params;
  }
}

@ObjectType()
export default class Entity {
  @Field((type) => String)
  public EntityType: string;
  @Field((type) => GraphQLJSONObject)
  public Properties: entityProperties;
  private _id: Id | null;

  constructor(entityType: string, properties: entityProperties, id: Id = null) {
    this.EntityType = entityType;
    this.Properties = properties;
    this._id = id;
  }

  @Field((type) => GraphQLJSONObject)
  get Id() {
    return this._id;
  }
}
