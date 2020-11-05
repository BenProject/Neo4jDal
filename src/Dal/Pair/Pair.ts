export default class Pair<TKey, TValue> {
  public Key: TKey;
  public Value: TValue;
  constructor(key: TKey, value: TValue) {
    this.Key = key;
    this.Value = value;
  }
}
