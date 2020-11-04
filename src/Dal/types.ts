interface IKickDBWrapper {
  createEntity(itemToCreate: object): boolean;
  updateEntityById(id: string): boolean;
  deleteById(id: string): boolean;
  getEntityById(id: string): Entity | null;
  getEntitiesByParams(params: Object): Array<Entity> | null;

  getEntityRelationsById(
    id: string,
    hopsNumber: number
  ): Array<OneWayRelation>;

  editEntitytRelationsById(
    id: string,
    relations: Array<OneWayRelation>
  ): boolean;
}

class OneWayRelation {
  public toId: string;
  public type: string;
  constructor(toId: string, type: string) {
    this.toId = toId;
    this.type = type;
  }
}

class TwoWaysRelation extends OneWayRelation {
  public fromId: string;

  constructor(fromId: string, toId: string, type: string) {
    super(toId, type);
    this.fromId = fromId;
  }
}

class Entity {
  id: string;
  type: string;
  properties: Object;
  Relations: Array<TwoWaysRelation>;
}
