import { v4 as uuid } from "uuid";

export interface IKickDBWrapper {
  createEntity(entityRelationsPair: EntityRelationsPair): Promise<boolean>;
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
  private _pair: Pair<Entity, Relation[] | null>;
  constructor(entity: Entity, relations: Relation[]) {
    this._pair = new Pair<Entity, Relation[]>(entity, relations);
  }
  get Relations() {
    return this._pair.Value;
  }

  get Entity() {
    return this._pair.Key;
  }
}

export class Relation {
  public RelType: string;
  public RelEntityId: string;
  public StartEntityId: string | null;
  public EndEntityId: string | null;

  constructor(relType: string, relEntityId: string, start = null, end = null) {
    this.RelType = relType;
    this.RelEntityId = relEntityId;
    this.StartEntityId = start;
    this.EndEntityId = end;
  }
}

export class Entity {
  public EntityType: string;
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
