import Entity from "./Entity";
import EntityRelationsPair from "./Pair/EntityRelationsPair";
import Relation from "./Relation";

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


