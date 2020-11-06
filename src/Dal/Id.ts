import { ArgsType, Field } from "type-graphql";

@ArgsType()
export default class Id {
  @Field((type) => String)
  public id: string;
  
  constructor(value: string) {
    this.id = value;
  }
}