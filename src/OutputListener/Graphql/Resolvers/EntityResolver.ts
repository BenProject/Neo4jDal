import "reflect-metadata";
import { Arg, Args, ArgsType, Field, Query, Resolver } from "type-graphql";
import Entity, { entityProperties } from "../../../Dal/Entity";
import { dbWrapper } from "../../../bootstrapper";
import Id from "../../../Dal/Id";
import { Min } from "class-validator";

@ArgsType()
class pagingArgs {
  @Field((type) => Number)
  @Min(0)
  entitiesPerPage: number;

  @Field((type) => Number)
  @Min(1)
  pageNumber: number;
}

@Resolver()
export default class EntityResolver {
  @Query((returns) => [Entity], {
    nullable: true,
    description: "get all entities matching params",
  })
  async entities(
    @Args() entityProperties: entityProperties,
    @Args() { entitiesPerPage, pageNumber }: pagingArgs
  ): Promise<Entity[]> {
    return Promise.resolve(
      await dbWrapper.getEntitiesByParams(
        entityProperties,
        pageNumber,
        entitiesPerPage
      )
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
