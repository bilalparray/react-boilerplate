import { QueryFilter } from "./query-filter";

export class OdataQueryFilter extends QueryFilter {
  override orderByCommand!: string;
  filterByCommand!: string;
}
