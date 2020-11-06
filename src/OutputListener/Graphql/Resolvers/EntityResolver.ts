import "reflect-metadata";
import { Args, ArgsType, Field, Query, Resolver } from "type-graphql";
import Entity, { entityProperties } from "../../../Dal/Entity";
import { dbWrapper } from "../../../bootstrapper";
import Id from "../../../Dal/Id";

@Resolver()
export default class EntityResolver {
  @Query((returns) => [Entity], {
    nullable: true,
    description: "get all entities matching params",
  })
  async entities(
    @Args() entityProperties: entityProperties
  ): Promise<Entity[]> {
    return Promise.resolve(
      await dbWrapper.getEntitiesByParams(entityProperties)
    );
  }

  @Query((returns) => Entity, {
    nullable: true,
    description: "get entity by id",
  })
  async entity(@Args() entityId: Id): Promise<Entity> {
    return Promise.resolve(await dbWrapper.getEntityById(entityId));
  }
}
