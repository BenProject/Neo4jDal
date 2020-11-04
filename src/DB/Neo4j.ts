import neo4j, { Driver, Session } from "neo4j-driver";

class Neo4j implements IKickDBWrapper {
  private _driver: Driver;
  private _session: Session;
  private _dbAdress: string;
  private _username: string;
  private _password: string;

  constructor(dbAdress: string, username: string, password: string) {
    this._dbAdress = dbAdress;
    this.init();
  }
  private init() {
    this.createConnection();
    this.createSession();
  }

  private createConnection() {
    this._driver = neo4j.driver(
      this._dbAdress,
      neo4j.auth.basic(this._username, this._password)
    );
  }
  private createSession() {
    this._session = this._driver.session();
  }

  createEntity(itemToCreate: object): boolean {
    throw new Error("Method not implemented.");
  }
  updateEntityById(id: string): boolean {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): boolean {
    throw new Error("Method not implemented.");
  }
  getEntityById(id: string): Entity {
    throw new Error("Method not implemented.");
  }
  getEntitiesByParams(params: Object): Entity[] {
    throw new Error("Method not implemented.");
  }
  getEntityRelationsById(id: string, hopsNumber: number): OneWayRelation[] {
    throw new Error("Method not implemented.");
  }
  editEntitytRelationsById(id: string, relations: OneWayRelation[]): boolean {
    throw new Error("Method not implemented.");
  }
}
