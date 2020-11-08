import "reflect-metadata";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Query,
  Resolver,
} from "type-graphql";
import Entity, { entityProperties } from "../../../Dal/Entity";
import { dbWrapper } from "../../../bootstrapper";
import Id from "../../../Dal/Id";
import { Min } from "class-validator";

@ArgsType()
class pageNumber {
  @Field((type) => Number)
  @Min(1)
  pageNumber: number;
}

@ArgsType()
class entitiesPerPage {
  @Field((type) => Number)
  @Min(0)
  entitiesPerPage: number;
}

@Resolver((of) => Entity)
export default class EntityResolver {
  @Query((returns) => [Entity], {
    nullable: true,
    description: "get all entities matching params",
  })
  async entities(
    @Args() entityProperties: entityProperties,
    @Args() { pageNumber }: pageNumber,
    @Args() { entitiesPerPage }: entitiesPerPage,
    @Arg("entityType", { nullable: true }) entityType: string
  ): Promise<Entity[]> {
    try {
      return Promise.resolve(
        await dbWrapper.getEntitiesByProperties(
          entityProperties,
          pageNumber,
          entitiesPerPage,
          entityType
        )
      );
    } catch (err) {
      return Promise.reject(`error while trying to get entities, err: ${err}`);
    }
  }

  @Query((returns) => Number, {
    nullable: false,
    description: "get number of pages",
  })
  async getPagesNumber(
    @Args() entityProperties: entityProperties,
    @Args() { entitiesPerPage }: entitiesPerPage
  ): Promise<Number> {
    try {
      return Promise.resolve(
        await dbWrapper.getNumberOfPages(entityProperties, entitiesPerPage)
      );
    } catch (err) {
      return Promise.reject(
        `error while trying to get entities pages count,err: ${err}`
      );
    }
  }

  @Query((returns) => Entity, {
    nullable: true,
    description: "get entity by id",
  })
  async entity(@Args() entityId: Id): Promise<Entity> {
    try {
      return Promise.resolve(await dbWrapper.getEntityById(entityId));
    } catch (err) {
      return Promise.reject(`error while trying to get entity,err: ${err}`);
    }
  }
}
