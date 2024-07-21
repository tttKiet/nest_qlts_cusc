import { SelectQueryBuilder } from 'typeorm';

export function addCondition(
  query: SelectQueryBuilder<any>,
  condition: string,
  parameters?: object,
) {
  if (query.expressionMap.wheres.length === 0) {
    query.where(condition, parameters);
  } else {
    query.andWhere(condition, parameters);
  }
}
