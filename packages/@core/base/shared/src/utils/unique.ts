/**
 * 根据指定字段对对象数组进行去重
 * @param arr 要去重的对象数组
 * @param key 去重依据的字段名
 * @returns 去重后的对象数组
 */
function uniqueByField<T>(arr: T[], key: keyof T): T[] {
  const seen = new Map<any, T>();
  return arr.filter((item) => {
    const value = item[key];
    return seen.has(value) ? false : (seen.set(value, item), true);
  });
}

const uniqueEmptyValues = (obj: any) => {
  const newObj: any = { ...obj };
  Object.keys(newObj).forEach((key) => {
    const value = newObj[key];
    // 检查各种"空"的情况
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newObj[key];
    }
  });
  return newObj;
};
export { uniqueByField, uniqueEmptyValues };
