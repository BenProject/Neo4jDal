import neo4j, { Driver, Session, Record } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { IKickDBWrapper } from "../Dal/interfaces";
import { JsonToStringWithoutQuotes } from "../utils";
import Integer from "neo4j-driver/lib/integer.js";
import { mapValues } from "lodash";
import Entity, { entityProperties } from "../Dal/Entity";
import Relation from "../Dal/Relation";
import EntityRelationsPair from "../Dal/Pair/EntityRelationsPair";
import Id from "../Dal/Id";

export default class Neo4j implements IKickDBWrapper {
  private _driver: Driver;
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
  }

  private createConnection() {
    this._driver = neo4j.driver(
      this._dbAdress,
      neo4j.auth.basic(this._username, this._password)
    );
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
      new Id(entityId.toString())
    );
  }

  private RecordToRelations(
    neo4jRecord: Record,
    relKey: string,
    entityId: Id
  ): Relation[] {
    const neo4jRelations = neo4jRecord.get(relKey);

    if (neo4jRelations instanceof Array && neo4jRelations.length === 0) {
      return [];
    }
    return neo4jRelations.map((relation) => {
      return new Relation(
        relation.type,
        entityId,
        new Id(relation.start.toString()),
        new Id(relation.end.toString())
      );
    });
  }

  async createEntity(entityRelationsPair: EntityRelationsPair): Promise<Id> {
    const session = this._driver.session();
    let queryString = "";
    const relations = entityRelationsPair.Relations;
    const entity = entityRelationsPair.Entity;

    let tempIdToRelationsMap = relations.map((relation) => {
      return { relId: this.generateTempNeo4jId(), relDetails: relation };
    });

    tempIdToRelationsMap.map((idToRelation) => {
      queryString = queryString.concat(
        ` MATCH(${idToRelation.relId}) WHERE toString(id(${idToRelation.relId}))="${idToRelation.relDetails.RelEntityId}"`
      );
    });

    queryString = queryString.concat(
      `MERGE (entity:${entity.EntityType} ${JsonToStringWithoutQuotes(
        entity.Properties
      )}) `
    );

    tempIdToRelationsMap.map((idToRelation) => {
      if (
        idToRelation.relDetails.EndEntityId ===
        idToRelation.relDetails.RelEntityId
      )
        queryString = queryString.concat(
          `MERGE ((entity)-[${this.generateTempNeo4jId()}:${
            idToRelation.relDetails.RelType
          }]->(${idToRelation.relId})) `
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

    queryString = queryString.concat(" RETURN entity");
    try {
      const result = await session.run(queryString);
      return Promise.resolve(
        new Id(result.records[0].get("entity").identity.toString())
      );
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.close();
    }
  }

  updateEntityById(id: Id): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: Id): Promise<boolean> {
    const session = this._driver.session();
    let queryString = "";
    queryString = queryString.concat(
      `MATCH (entity) WHERE toString(id(entity))="${id.id}" DETACH DELETE entity`
    );
    try {
      await session.run(queryString);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.close();
    }
  }

  async getEntityById(id: Id): Promise<Entity> {
    const session = this._driver.session();
    let queryString = "";
    queryString = queryString.concat(
      `MATCH (entity) WHERE toString(id(entity))="${id.id}" RETURN entity`
    );

    try {
      let results = await session.run(queryString);
      const entity = this.RecordToEntity(results.records[0], "entity");
      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.close();
    }
  }

  async getEntitiesByProperties(
    properties: entityProperties,
    pageNumber: number,
    entitiesPerPage: number,
    entityType: string | null = null
  ): Promise<Entity[]> {
    const session = this._driver.session();
    let queryString = "";
    queryString = queryString.concat(
      `MATCH(entities${
        entityType ? `:${entityType}` : ""
      } ${JsonToStringWithoutQuotes(
        properties.Params
      )}) RETURN entities ORDER BY id(entities) SKIP ${
        entitiesPerPage * (pageNumber - 1)
      } LIMIT ${entitiesPerPage}`
    );
    try {
      const results = await session.run(queryString);
      return Promise.resolve(
        results.records.map((record) => this.RecordToEntity(record, "entities"))
      );
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.close();
    }
  }

  async getNumberOfPages(
    properties: entityProperties,
    entitiesPerPage: number
  ): Promise<number> {
    const session = this._driver.session();
    let queryString = "";
    queryString = queryString.concat(
      `match(entities ${JsonToStringWithoutQuotes(
        properties.Params
      )}) return count(entities)/${entitiesPerPage}`
    );

    try {
      const results = await session.run(queryString);
      return Promise.resolve(
        results.records[0]
          .get(`count(entities)/${entitiesPerPage}`)
          .toNumber() + 1
      );
    } catch (err) {
      return Promise.reject(err);
    } finally {
      session.close();
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
        new Id(neo4jRecord.get(entityKey).identity.toString())
      )
    );
  }

  async getEntityRelationsById(
    id: Id,
    hopsNumber: number,
    relationType: string | null
  ): Promise<Array<EntityRelationsPair>> {
    const session = this._driver.session();
    let queryString = "";
    let relatedEntites = new Array<EntityRelationsPair>();

    queryString = queryString.concat(
      `MATCH (entity) WHERE toString(id(entity))="${id.id}"`
    );

    queryString = queryString.concat(
      `MATCH (entity)-[${
        relationType ? `rel:${relationType}` : "rel "
      }*0..${hopsNumber}]-(neighbor) RETURN neighbor, rel`
    );

    try {
      const results = await session.run(queryString);
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
    } finally {
      session.close();
    }
  }

  editEntitytRelationsById(id: Id, relations: Relation[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
