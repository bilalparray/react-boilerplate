import type { AxiosResponse } from "axios";
import type { IDictionaryCollection } from "../../../models/internal/Idictionary-collection";
import type { SampleErrorLogModel } from "../../../models/internal/sample-error-model";
import { BaseAjaxClient } from "../base-ajax.client";
import { ApiRequest } from "../../../models/service/foundation/api-contracts/base/api-request";
import { DictionaryCollection } from "../../../models/internal/dictionary-collection";
import { AppConstants } from "../../../app-constants";

export class LoggerClient extends BaseAjaxClient {
  constructor() {
    super();
  }

  async SendLogsToServerAsync(
    logsArr: SampleErrorLogModel[],
    headers: IDictionaryCollection<string, string> | null
  ): Promise<AxiosResponse> {
    const apiReq = new ApiRequest<SampleErrorLogModel[]>();
    apiReq.reqData = logsArr;

    if (!headers) headers = new DictionaryCollection<string, string>();

    headers.Add(
      AppConstants.HEADER_NAMES.ApiType,
      AppConstants.HEADER_VALUES.ApiType
    );
    headers.Add(
      AppConstants.HEADER_NAMES.DevApk,
      AppConstants.HEADER_VALUES.DevApk
    );
    headers.Add(
      AppConstants.HEADER_NAMES.AppVersion,
      AppConstants.HEADER_VALUES.AppVersion
    );

    return this.GetHttpDataAsync<ApiRequest<SampleErrorLogModel[]>>(
      AppConstants.API_ENDPOINTS.LOG_URL,
      "POST",
      apiReq,
      headers,
      "application/json"
    );
  }
}
