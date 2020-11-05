export default class Entity {
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
  