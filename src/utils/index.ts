export function JsonToStringWithoutQuotes(obj: Object) {
  return `${JSON.stringify(obj).replace(/"([^"]+)":/g, "$1:")}`;
}
