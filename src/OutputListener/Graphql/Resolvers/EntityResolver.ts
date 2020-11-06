import "reflect-metadata";
import { Args, ArgsType, Field, Query, Resolver } from "type-graphql";
import Entity, { entityProperties } from "../../../Dal/Entity";
import { dbWrapper } from "../../../bootstrapper";


@Resolver()
export default class EntityResolver {
  @Query((returns) => [Entity], {
    nullable: true,
    description: "get all entities matching params",
  })
  async entities(@Args() entityProperties: entityProperties): Promise<Entity[]> {
    return Promise.resolve(
      await dbWrapper.getEntitiesByParams(entityProperties)
    );
  }
}
