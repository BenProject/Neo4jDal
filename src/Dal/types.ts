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
  public ToId: string;
  public Type: string;
  constructor(toId: string, type: string) {
    this.ToId = toId;
    this.Type = type;
  }
}

class TwoWaysRelation extends OneWayRelation {
  public FromId: string;

  constructor(fromId: string, toId: string, type: string) {
    super(toId, type);
    this.FromId = fromId;
  }
}

class Entity {
  public Id: string;
  public Type: string;
  public Properties: Object;
  public Relations: Array<TwoWaysRelation>;
}
