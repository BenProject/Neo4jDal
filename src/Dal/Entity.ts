import { ArgsType, Field, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ArgsType()
export class entityProperties {
  @Field((type) => GraphQLJSONObject)
  public Props: Object;
  constructor(params: Object) {
    this.Props = params;
  }
}

@ObjectType()
export default class Entity {
  @Field((type) => String)
  public EntityType: string;
  @Field((type) => GraphQLJSONObject)
  public Properties: entityProperties;

  private _id: string;

  constructor(
    entityType: string,
    properties: entityProperties,
    id: string | null = null
  ) {
    this.EntityType = entityType;
    this.Properties = properties;
    this._id = id;
  }

  @Field((type) => String)
  get Id() {
    return this._id;
  }
}
