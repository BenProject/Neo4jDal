import Entity, { entityProperties } from "./Entity";
import Id from "./Id";
import EntityRelationsPair from "./Pair/EntityRelationsPair";
import Relation from "./Relation";

export interface IKickDBWrapper {
  createEntity(entityRelationsPair: EntityRelationsPair): Promise<Id>;
  updateEntityById(id: Id): Promise<boolean>;
  deleteById(id: Id): Promise<boolean>;
  getEntityById(id: Id): Promise<Entity> | null;
  getEntitiesByProperties(
    properties: entityProperties,
    pageNumber: number,
    entitiesPerPage: number
  ): Promise<Array<Entity>> | null;

  getNumberOfPages(
    properties: entityProperties,
    entitiesPerPage: number
  ): Promise<number>;

  getEntityRelationsById(
    id: Id,
    hopsNumber: number,
    relationType: string | null
  ): Promise<Array<EntityRelationsPair>>;

  editEntitytRelationsById(
    id: Id,
    relations: Array<Relation>
  ): Promise<boolean>;
}
