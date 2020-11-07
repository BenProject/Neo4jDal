import { GraphQLJSONObject } from "graphql-type-json";
import { Field, ObjectType, NonEmptyArray } from "type-graphql";
import Entity from "../Entity";
import Relation from "../Relation";
import Pair from "./Pair";

@ObjectType()
export default class EntityRelationsPair {
  // @Field((type) => GraphQLJSONObject)
  private _pair: Pair<Entity, Relation[] | null>;

  constructor(entity: Entity, relations: Relation[]) {
    this._pair = new Pair<Entity, Relation[]>(entity, relations);
  }

  @Field((type) => [Relation])
  get Relations() {
    return this._pair.Value;
  }

  @Field((type) => Entity)
  get Entity() {
    return this._pair.Key;
  }
}
