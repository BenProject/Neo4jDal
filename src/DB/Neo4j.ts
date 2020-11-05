import neo4j, { Driver, Session, Record } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import {
  IKickDBWrapper,
  Entity,
  Relation,
  EntityRelationsPair,
} from "../Dal/types";
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
  createEntity(itemToCreate: Entity): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getEntityById(id: string): Promise<Entity> {
    throw new Error("Method not implemented.");
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

  //   async createEntity(itemToCreate: Entity): Promise<boolean> {
  //     let queryString = "";
  // idToRelation

  //   itemToCreate.Relations.map(relation=>{
  // })
  //     itemToCreate.Relations.map((relation) => {
  //       queryString = queryString.concat(
  //         ` MATCH(${this.idToNeo4jId(relation.Id)} {id:"${
  //           relation.RelEntityId
  //         }"})`
  //       );
  //     });

  //     itemToCreate.Properties["id"] = itemToCreate.Id;
  //     queryString = queryString.concat(
  //       `MERGE (entity:${itemToCreate.EntityType} ${JsonToStringWithoutQuotes(
  //         itemToCreate.Properties
  //       )})`
  //     );

  //     itemToCreate.Relations.map((relation) => {
  //       if (relation.PointingOnRelEntity)
  //         queryString = queryString.concat(
  //           `MERGE ((entity)-[${this.idToNeo4jId(uuid())}:${
  //             relation.RelType
  //           }]->(${this.idToNeo4jId(relation.Id)}))`
  //         );
  //       if (relation.RelEntityPointingOnMe)
  //         queryString = queryString.concat(
  //           `MERGE ((${this.idToNeo4jId(relation.Id)})-[${this.idToNeo4jId(
  //             uuid()
  //           )}:${relation.RelType}]->(entity))`
  //         );
  //     });

  //     try {
  //       let result = await this._session.run(queryString);
  //       //   result.records
  //       return Promise.resolve(
  //         result.summary.counters["_stats"].nodesCreated != 0
  //       );
  //     } catch (err) {
  //       return Promise.reject(err);
  //     }
  //   }

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

  //   async getEntityById(id: string): Promise<Entity> {
  //     let queryString = "";
  //     queryString = queryString.concat(
  //       `MATCH (entity {id:"${id}"}) return entity`
  //     );

  //     try {
  //       let results = await this._session.run(queryString);
  //       const entityDetails = results.records[0].get("entity");
  //       const entityId = entityDetails.properties.id;
  //       delete entityDetails.properties.id;

  //       entityDetails.properties = this.neo4jIntegerToNumber(
  //         entityDetails.properties
  //       );

  //       return Promise.resolve(
  //         new Entity(
  //           entityId,
  //           entityDetails.labels[0],
  //           entityDetails.properties,
  //           []
  //         )
  //       );
  //     } catch (err) {
  //       return Promise.reject(err);
  //     }
  //   }
  getEntitiesByParams(params: Object): Promise<Entity[]> {
    throw new Error("Method not implemented.");
  }

  private RecordToEntity(neo4jRecord: Record, entityKey: string): Entity {
    const recordDetails = neo4jRecord.get(entityKey);
    let entityProperties = recordDetails.properties;

    const entityId = recordDetails.identity;
    // delete entityProperties.id;

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
        relation.start.toString(),
        relation.end.toString()

        // entityId.compare(relation.start) === 0,
        // entityId.compare(relation.end) === 0
      );
    });
  }

  private neo4jRecordToEntityAndEntityRelationsPair(
    neo4jRecord: Record
  ): EntityRelationsPair {
    return new EntityRelationsPair(
      this.RecordToEntity(neo4jRecord, "neighbor"),
      this.RecordToRelations(
        neo4jRecord,
        "rel",
        neo4jRecord.get("neighbor").identity
      )
    );
  }

  async getEntityRelationsById(
    id: string,
    hopsNumber: number,
    relationType: string | null
  ): Promise<Array<EntityRelationsPair>> {
    let queryString = "";
    // let relatedEntites = []: Array<EntityRelationsPair>;
    let relatedEntites = new Array<EntityRelationsPair>();

    queryString = queryString.concat(`MATCH (entity {id:"${id}"})`);

    queryString = queryString.concat(
      `MATCH (entity)-[${
        relationType ? `rel:${relationType}` : "rel "
      }*0..${hopsNumber}]-(neighbor) RETURN neighbor, distinct(rel)`
    );

    try {
      let results = await this._session.run(queryString);
      results.records.map((record) =>
        relatedEntites.push(
          this.neo4jRecordToEntityAndEntityRelationsPair(record)
        )
      );

      Promise.resolve(relatedEntites);
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
