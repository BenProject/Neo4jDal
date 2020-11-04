import { v4 as uuid } from "uuid";

export interface IKickDBWrapper {
  createEntity(itemToCreate: Entity): Promise<boolean>;
  updateEntityById(id: string): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  getEntityById(id: string): Promise<Entity> | null;
  getEntitiesByParams(params: Object): Promise<Array<Entity>> | null;

  getEntityRelationsById(
    id: string,
    hopsNumber: number
  ): Promise<Array<Relation>>;

  editEntitytRelationsById(
    id: string,
    relations: Array<Relation>
  ): Promise<boolean>;
}

export class Relation {
  public RelEntityId: string;
  public RelType: string;
  public PointingOnRelEntity: boolean;
  private _id: string;

  constructor(
    relEntityId: string,
    relType: string,
    pointingOnRelEntity: boolean,
    id: string
  ) {
    this.RelEntityId = relEntityId;
    this.RelType = relType;
    this.PointingOnRelEntity = pointingOnRelEntity;
    this._id = id;
  }

  get Id() {
    return this._id;
  }
}

export class Entity {
  private _id: string;
  public EntityType: string;
  public Properties: Object;
  public Relations: Array<Relation>;

  constructor(
    id: string,
    entityType: string,
    properties: Object,
    realtions: Array<Relation>
  ) {
    this._id = id;
    this.EntityType = entityType;
    this.Properties = properties;
    this.Relations = realtions;
  }

  get Id() {
    return this._id;
  }
}
