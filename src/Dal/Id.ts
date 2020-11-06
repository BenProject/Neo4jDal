import { ArgsType, Field, ObjectType } from "type-graphql";

@ObjectType()
@ArgsType()
export default class Id {
  @Field((type) => String)
  public id: string;
  
  constructor(value: string) {
    this.id = value;
  }
}