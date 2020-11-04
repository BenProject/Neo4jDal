import neo4j, { Driver, Session } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { IKickDBWrapper, Entity, Relation } from "../Dal/types";
import { JsonToStringWithoutQuotes } from "../utils";
import Integer from "neo4j-driver/lib/integer.js";
import { mapValues } from "lodash";

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

  private neo4jIntegerToNumber(properties: Object) {
    return mapValues(properties, (propVal) => {
      if (propVal instanceof Integer)
        return propVal.inSafeRange() ? propVal.toNumber() : propVal.toString();
      return propVal;
    });
  }

  async createEntity(itemToCreate: Entity): Promise<boolean> {
    let queryString = "";

    itemToCreate.Relations.map((relation) => {
      queryString = queryString.concat(
        ` MATCH(${this.idToNeo4jId(relation.Id)} {id:"${
          relation.RelEntityId
        }"})`
      );
    });

    itemToCreate.Properties["id"] = itemToCreate.Id;
    queryString = queryString.concat(
      `CREATE (entity:${itemToCreate.EntityType} ${JsonToStringWithoutQuotes(
        itemToCreate.Properties
      )})`
    );

    itemToCreate.Relations.map((relation) => {
      if (relation.PointingOnRelEntity)
        queryString = queryString.concat(
          `CREATE ((entity)-[${this.idToNeo4jId(uuid())}:${
            relation.RelType
          }]->(${this.idToNeo4jId(relation.Id)}))`
        );
      if (relation.RelEntityPointingOnMe)
        queryString = queryString.concat(
          `MERGE ((${this.idToNeo4jId(relation.Id)})-[${this.idToNeo4jId(
            uuid()
          )}:${relation.RelType}]->(entity))`
        );
    });

    try {
      let result = await this._session.run(queryString);
      //   result.records
      return Promise.resolve(
        result.summary.counters["_stats"].nodesCreated != 0
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  updateEntityById(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: string): Promise<boolean> {
    let queryString = "";
    queryString = queryString.concat(
      `MATCH (entity {id:"${id}"}) detach DELETE entity`
    );
    try {
      await this._session.run(queryString);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getEntityById(id: string): Promise<Entity> {
    let queryString = "";
    queryString = queryString.concat(
      `MATCH (entity {id:"${id}"}) return entity`
    );

    try {
      let results = await this._session.run(queryString);
      const entityDetails = results.records[0].get("entity");
      const entityId = entityDetails.properties.id;
      delete entityDetails.properties.id;

      entityDetails.properties = this.neo4jIntegerToNumber(
        entityDetails.properties
      );

      return Promise.resolve(
        new Entity(
          entityId,
          entityDetails.labels[0],
          entityDetails.properties,
          []
        )
      );
    } catch (err) {
      return Promise.reject(err);
    }
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
