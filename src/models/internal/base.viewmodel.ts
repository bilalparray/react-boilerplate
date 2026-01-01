import { QueryFilter } from "../service/foundation/api-contracts/query-filter";
import { InputControlInformation } from "./common-models";
import { PaginationViewModel } from "./pagination.viewmodel";

export class BaseViewModel {
  PageTitle: string = "";
  PageNo?: number = 0;
  PageSize?: number = 10;
  FormSubmitted?: boolean;
  pagination: PaginationViewModel = {
    PageNo: 1,
    PageSize: 2,
    totalCount: 0,
    totalPages: [],
  };
  queryFilter: QueryFilter = {
    skip: 0,
    top: 2,
    searchType: "",
    searchText: "",
    searchColumns: "",
    expandFields: "",
    inlineCount: false,
    selectFields: "",
    orderByCommand: "",
    // filterExpression: "firstname eq 'zaid'",
  };
  controlsInformation?: { [key: string]: InputControlInformation };
}
