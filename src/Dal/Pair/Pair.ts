import { Field, ObjectType, ClassType } from "type-graphql";

// @ObjectType({ isAbstract: true })
export default class Pair<TKey, TValue> {
  // @Field((type) => ClassType<TKey>)
  public Key: TKey;

  // @Field((type) => ClassType<TValue>)
  public Value: TValue;

  constructor(key: TKey, value: TValue) {
    this.Key = key;
    this.Value = value;
  }
}

// export default function Pair<TKey, TValue>(
//   TKeyClass: ClassType<TKey>,
//   // TValueClass: ClassType<TValue>
// ) {

//   @ObjectType({ isAbstract: true })
//   abstract class PairClass<TKey, TValue> {
//     @Field((type) => TKeyClass)
//     public Key: TKey;

//     // @Field((type) => TValueClass)
//     // public Value: TValue;

//     // constructor(key: TKey, value: TValue) {
//     //   this.Key = key;
//     //   this.Value = value;
//     // }
//   }
//   return PairClass;
// }

// export default class Pair<TKey,TValue> extends Paira<TKey,TValue>{

// }
