import neo4j, { Driver, Session } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { IKickDBWrapper, Entity, Relation } from "../Dal/types";
import { JsonToStringWithoutQuotes } from "../utils";

export default class Neo4j implements IKickDBWrapper {
  private _driver: Driver;
  private _session: Session;
  private _dbAdress: string;
  private _username: string;
  private _password: string;

  constructor(dbAdress: string, username: string, password: string) {
    this._dbAdress = dbAdress;
    this._username = username;
    this._password = password;
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

  // neo4j id can not start with number and cannot have dashes
  private idToNeo4jId(id: string) {
    return `a${id.replace(/-/g, "")}`;
  }

  async createEntity(itemToCreate: Entity): Promise<boolean> {
    let queryString = "";

    itemToCreate.Relations.map((relation) => {
      queryString = queryString.concat(
        ` MATCH(${this.idToNeo4jId(relation.Id)} {id:"${relation.RelEntityId}"})`
      );
    });

    itemToCreate.Properties["id"] = itemToCreate.Id;
    queryString = queryString.concat(
      `Create (entity:${itemToCreate.EntityType} ${JsonToStringWithoutQuotes(
        itemToCreate.Properties
      )})`
    );

    itemToCreate.Relations.map((relation) => {
     if (relation.PointingOnRelEntity)
      queryString = queryString.concat(
        `Create ((entity)-[${this.idToNeo4jId(uuid())}:${relation.RelType}]->(${this.idToNeo4jId(relation.Id)}))`
      );
      if(relation.RelEntityPointingOnMe)
      queryString = queryString.concat(
        `Create ((${this.idToNeo4jId(relation.Id)})-[${this.idToNeo4jId(uuid())}:${relation.RelType}]->(entity))`
      );

    });

    try {
      await this._session.run(queryString);
      return true;
    } catch (err) {
      console.log("error whiile creating entity, ", err);
      return false;
    }
  }

  updateEntityById(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getEntityById(id: string): Promise<Entity> {
    throw new Error("Method not implemented.");
  }
  getEntitiesByParams(params: Object): Promise<Entity[]> {
    throw new Error("Method not implemented.");
  }
  getEntityRelationsById(id: string, hopsNumber: number): Promise<Relation[]> {
    throw new Error("Method not implemented.");
  }
  editEntitytRelationsById(
    id: string,
    relations: Relation[]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
