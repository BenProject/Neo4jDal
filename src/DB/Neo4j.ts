import neo4j, { Driver, Session, Record } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { IKickDBWrapper } from "../Dal/interfaces";
import { JsonToStringWithoutQuotes } from "../utils";
import Integer from "neo4j-driver/lib/integer.js";
import { mapValues } from "lodash";
import Entity, { entityProperties } from "../Dal/Entity";
import Relation from "../Dal/Relation";
import EntityRelationsPair from "../Dal/Pair/EntityRelationsPair";

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
  private generateTempNeo4jId() {
    return `a${uuid().replace(/-/g, "")}`;
  }

  private neo4jIntegerToNumber(properties: Object) {
    return mapValues(properties, (propVal) => {
      if (propVal instanceof Integer)
        return propVal.inSafeRange() ? propVal.toNumber() : propVal.toString();
      return propVal;
    });
  }

  private RecordToEntity(neo4jRecord: Record, entityKey: string): Entity {
    const recordDetails = neo4jRecord.get(entityKey);
    let entityProperties = recordDetails.properties;

    const entityId = recordDetails.identity;

    entityProperties = this.neo4jIntegerToNumber(entityProperties);
    return new Entity(
      recordDetails.labels[0],
      entityProperties,
      entityId.toString()
    );
  }

  private RecordToRelations(
    neo4jRecord: Record,
    relKey: string,
    entityId
  ): Relation[] {
    const neo4jRelations = neo4jRecord.get(relKey);

    if (neo4jRelations instanceof Array && neo4jRelations.length === 0) {
      return [];
    }
    return neo4jRelations.map((relation) => {
      return new Relation(
        relation.type,
        entityId.toString(),
        relation.start.toString(),
        relation.end.toString()
      );
    });
  }

  async createEntity(
    entityRelationsPair: EntityRelationsPair
  ): Promise<boolean> {
    let queryString = "";
    let relations = entityRelationsPair.Relations;
    let entity = entityRelationsPair.Entity;

    let tempIdToRelationsMap = relations.map((relation) => {
      return { relId: this.generateTempNeo4jId(), relDetails: relation };
    });

    tempIdToRelationsMap.map((idToRelation) => {
      queryString = queryString.concat(
        ` MATCH(${idToRelation.relId}) where toString(id(${idToRelation.relId}))="${idToRelation.relDetails.RelEntityId}"`
      );
    });

    queryString = queryString.concat(
      `MERGE (entity:${entity.EntityType} ${JsonToStringWithoutQuotes(
        entity.Properties.Params
      )})`
    );

    tempIdToRelationsMap.map((idToRelation) => {
      if (
        idToRelation.relDetails.EndEntityId ===
        idToRelation.relDetails.RelEntityId
      )
        queryString = queryString.concat(
          `MERGE ((entity)-[${this.generateTempNeo4jId()}:${
            idToRelation.relDetails.RelType
          }]->(${idToRelation.relId}))`
        );
      if (
        idToRelation.relDetails.StartEntityId ===
        idToRelation.relDetails.RelEntityId
      )
        queryString = queryString.concat(
          `MERGE ((${idToRelation.relId})-[${this.generateTempNeo4jId()}:${
            idToRelation.relDetails.RelType
          }]->(entity))`
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
      `MATCH (entity) WHERE toString(id(entity))="${id}" DETACH DELETE entity`
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
      `MATCH (entity) WHERE toString(id(entity))="${id}" RETURN entity`
    );

    try {
      let results = await this._session.run(queryString);
      const entity = this.RecordToEntity(results.records[0], "entity");
      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getEntitiesByParams(properties: entityProperties): Promise<Entity[]> {
    let queryString = "";
    queryString = queryString.concat(
      `match(entities ${JsonToStringWithoutQuotes(
        properties.Params
      )}) return entities`
    );
    try {
      let results = await this._session.run(queryString);
      return Promise.resolve(
        results.records.map((record) => this.RecordToEntity(record, "entities"))
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private neo4jRecordToEntityAndEntityRelationsPair(
    neo4jRecord: Record,
    entityKey: string,
    relKey: string
  ): EntityRelationsPair {
    return new EntityRelationsPair(
      this.RecordToEntity(neo4jRecord, entityKey),
      this.RecordToRelations(
        neo4jRecord,
        relKey,
        neo4jRecord.get(entityKey).identity
      )
    );
  }

  async getEntityRelationsById(
    id: string,
    hopsNumber: number,
    relationType: string | null
  ): Promise<Array<EntityRelationsPair>> {
    let queryString = "";
    let relatedEntites = new Array<EntityRelationsPair>();

    queryString = queryString.concat(
      `MATCH (entity) WHERE toString(id(entity))="${id}"`
    );

    queryString = queryString.concat(
      `MATCH (entity)-[${
        relationType ? `rel:${relationType}` : "rel "
      }*0..${hopsNumber}]-(neighbor) RETURN neighbor, rel`
    );

    try {
      let results = await this._session.run(queryString);
      results.records.map((record) =>
        relatedEntites.push(
          this.neo4jRecordToEntityAndEntityRelationsPair(
            record,
            "neighbor",
            "rel"
          )
        )
      );

      return Promise.resolve(relatedEntites);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  editEntitytRelationsById(
    id: string,
    relations: Relation[]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
