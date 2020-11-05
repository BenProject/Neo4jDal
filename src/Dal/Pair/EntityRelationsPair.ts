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
  