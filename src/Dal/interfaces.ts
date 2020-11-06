import Entity from "./Entity";
import Id from "./Id";
import EntityRelationsPair from "./Pair/EntityRelationsPair";
import Relation from "./Relation";

export interface IKickDBWrapper {
  createEntity(entityRelationsPair: EntityRelationsPair): Promise<boolean>;
  updateEntityById(id: Id): Promise<boolean>;
  deleteById(id: Id): Promise<boolean>;
  getEntityById(id: Id): Promise<Entity> | null;
  getEntitiesByParams(params: Object): Promise<Array<Entity>> | null;

  getEntityRelationsById(
    id: Id,
    hopsNumber: number,
    relationType: "string" | null
  ): Promise<Array<EntityRelationsPair>>;

  editEntitytRelationsById(
    id: Id,
    relations: Array<Relation>
  ): Promise<boolean>;
}
