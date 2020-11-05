import { v4 as uuid } from "uuid";

export interface IKickDBWrapper {
  createEntity(itemToCreate: Entity): Promise<boolean>;
  updateEntityById(id: string): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  getEntityById(id: string): Promise<Entity> | null;
  getEntitiesByParams(params: Object): Promise<Array<Entity>> | null;

  getEntityRelationsById(
    id: string,
    hopsNumber: number,
    relationType: "string" | null
  ): Promise<Array<EntityRelationsPair>>;

  editEntitytRelationsById(
    id: string,
    relations: Array<Relation>
  ): Promise<boolean>;
}

class Pair<TKey, TValue> {
  public Key: TKey;
  public Value: TValue;
  constructor(key: TKey, value: TValue) {
    this.Key = key;
    this.Value = value;
  }
}

export class EntityRelationsPair {
  public Pair: Pair<Entity, Relation[] | null>;
  constructor(entity: Entity, relations: Relation[]) {
    this.Pair = new Pair<Entity, Relation[]>(entity, relations);
  }
}

export class Relation {
  public RelType: string;
  public RelEntityId: string;
  public Start: string | null;
  public End: string | null;

  constructor(relType: string, relEntityId: string, start = null, end = null) {
    this.RelType = relType;
    this.RelEntityId = relEntityId;
    this.Start = start;
    this.End = end;
  }
}

export class Entity {
  private _id: string | null;
  public EntityType: string;
  public Properties: Object;

  constructor(entityType: string, properties: Object, id: string = null) {
    this._id = id;
    this.EntityType = entityType;
    this.Properties = properties;
  }

  get Id() {
    return this._id;
  }
}
