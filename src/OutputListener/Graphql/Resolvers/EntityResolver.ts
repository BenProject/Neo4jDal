import "reflect-metadata";
import { GraphQLJSONObject } from "graphql-type-json";
import { Args, ArgsType, Field, Query, Resolver } from "type-graphql";
import Entity from "../../../Dal/Entity";
import { IKickDBWrapper } from "../../../Dal/interfaces";
import Neo4j from "../../../DB/Neo4j";
import { dbWrapper } from "../../../bootstrapper";

@ArgsType()
export class entityProps {
  @Field((type) => GraphQLJSONObject)
  public properties: Object;
}

@Resolver()
export default class EntityResolver {
  @Query((returns) => [Entity], { nullable: true })
  async entity(@Args() entityProperties: entityProps): Promise<Entity[]> {
    return Promise.resolve(
      await dbWrapper.getEntitiesByParams(entityProperties.properties)
    );
  }
}
