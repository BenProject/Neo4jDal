import "reflect-metadata";
import {
  Arg,
  Args,
  Query,
  Resolver,
  ArgOptions,
  Field,
  ArgsType,
} from "type-graphql";
import Id from "../../../Dal/Id";
import EntityRelationsPair from "../../../Dal/Pair/EntityRelationsPair";
import { dbWrapper } from "../../../bootstrapper";
import { GraphQLJSONObject } from "graphql-type-json";
import { Min } from "class-validator";

@ArgsType()
class relationsArgs {
  @Field((type) => Number)
  @Min(0)
  hopsNumber: number;

  @Field((type) => String, { nullable: true })
  relationType: string;
}

@Resolver()
export default class RelationResolver {
  @Query((returns) => [EntityRelationsPair], {
    nullable: true,
    description: "get entity relations by id and hops number",
  })
  async relations(
    @Args() entityId: Id,
    @Args() { hopsNumber, relationType }: relationsArgs
  ): Promise<Array<EntityRelationsPair>> {
    try {
      return Promise.resolve(
        await dbWrapper.getEntityRelationsById(
          entityId,
          hopsNumber,
          relationType
        )
      );
    } catch (err) {
      return Promise.reject(
        `error while trying to get entities relations,err: ${err}`
      );
    }
  }
}
