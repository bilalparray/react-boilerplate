import type { Method, AxiosResponse } from "axios";
import { AppConstants } from "../../app-constants";
import { environment } from "../../environment";
import {
  AdditionalRequestDetails,
  Authentication,
} from "../../models/internal/additional-request-details";
import { DictionaryCollection } from "../../models/internal/dictionary-collection";
import type { IDictionaryCollection } from "../../models/internal/Idictionary-collection";
import type { ApiRequest } from "../../models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "../../models/service/foundation/api-contracts/base/api-response";
import { ErrorData } from "../../models/service/foundation/api-contracts/error-data";
import { ApiErrorTypeSM } from "../../models/service/foundation/enums/api-error-type-s-m.enum";
import { StorageService } from "../../store/storageService";

import { BaseAjaxClient } from "./base-ajax.client";
import type { CommonResponseCodeHandler } from "./helpers/common-response-code-handler.helper";
import { CommonUtils } from "./helpers/common-utils.helper";
import { StorageCache } from "./helpers/storage-cache.helper";

export abstract class BaseApiClient extends BaseAjaxClient {
  // 🔴 These MUST be real class fields in React
  protected storageService: StorageService;
  protected storageCacheHelper: StorageCache;
  protected commonResponseCodeHandler: CommonResponseCodeHandler;

  constructor(
    storageService: StorageService,
    commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super();
    this.storageService = storageService;
    this.commonResponseCodeHandler = commonResponseCodeHandler;
    this.storageCacheHelper = StorageCache.getInstance();
  }

  // ─────────────────────────────────────────────────────────────

  protected async GetResponseAsync<InReq, OutResp>(
    relativeUrl: string,
    reqMethod: Method = "GET",
    reqBody: ApiRequest<InReq> | null = null,
    additionalRequestDetails: AdditionalRequestDetails<OutResp> = new AdditionalRequestDetails<OutResp>(
      false
    )
  ): Promise<ApiResponse<OutResp>> {
    let responseEntity: ApiResponse<OutResp> | null = null;
    let axiosResp: AxiosResponse<any> | null = null;

    try {
      if (!additionalRequestDetails)
        throw new Error("AdditionalRequestDetails cannot be null");

      const fullUrlToHit = CommonUtils.CombineUrl(
        environment.apiBaseUrl,
        relativeUrl
      );

      // ───── CACHE CHECK ─────
      responseEntity =
        await this.storageCacheHelper.getResponseFromDbIfPresent<OutResp>(
          fullUrlToHit,
          reqMethod,
          additionalRequestDetails
        );

      if (responseEntity) return responseEntity;

      // ───── HEADERS ─────
      additionalRequestDetails.headers = await this.addCommonHeaders(
        additionalRequestDetails.headers
      );

      // ───── AUTH ─────
      if (additionalRequestDetails.enableAuth === Authentication.TRUE) {
        const token = await this.storageService.getDataFromAnyStorage(
          AppConstants.DATABASE_KEYS.ACCESS_TOKEN
        );

        if (!token)
          throw new Error(`Token not found for URL - '${relativeUrl}'`);

        additionalRequestDetails.headers.Add(
          "Authorization",
          `Bearer ${token}`
        );
      }

      // ───── HTTP ─────
      axiosResp = await this.GetHttpDataAsync<ApiRequest<InReq>>(
        fullUrlToHit,
        reqMethod,
        reqBody,
        additionalRequestDetails.headers,
        additionalRequestDetails.contentType
      );

      // ───── STATUS HANDLER ─────
      if (
        this.commonResponseCodeHandler.handlerDict
          .Keys()
          .includes(axiosResp.status.toString())
      ) {
        const errMsg = this.commonResponseCodeHandler.handlerDict.Item(
          axiosResp.status.toString()
        )(axiosResp);

        return this.createGenericApiResponseObject(errMsg);
      }

      // ───── NORMALIZE RESPONSE ─────
      responseEntity = await this.createResponseEntityFromAxiosResp<OutResp>(
        axiosResp,
        additionalRequestDetails.custRespResolver
      );

      if (!responseEntity) throw new Error("Null response formed");

      // ───── CACHE WRITE ─────
      await this.storageCacheHelper.addOrUpdateResponseInCacheIfApplicable(
        fullUrlToHit,
        reqMethod,
        additionalRequestDetails,
        responseEntity
      );

      return responseEntity;
    } catch (x) {
      const msg = x instanceof Error ? x.message : JSON.stringify(x);
      const resp = this.createGenericApiResponseObject<OutResp>(msg);
      if (axiosResp) resp.axiosResponse = axiosResp;
      return resp;
    }
  }

  // ─────────────────────────────────────────────────────────────

  private async createResponseEntityFromAxiosResp<OutResp>(
    axiosResp: AxiosResponse,
    respResolver: ((resp: AxiosResponse) => ApiResponse<OutResp>) | null
  ): Promise<ApiResponse<OutResp>> {
    let ret: ApiResponse<OutResp> | null = null;

    if (axiosResp.status >= 200 && axiosResp.status < 300) {
      ret = respResolver
        ? respResolver(axiosResp)
        : (axiosResp.data as ApiResponse<OutResp>);
    } else if (axiosResp.data?.isError !== undefined) {
      ret = axiosResp.data;
    }

    if (!ret) {
      ret = this.createGenericApiResponseObject(
        `Unknown error occured - status '${axiosResp.status}'`
      );
    }

    ret.axiosResponse = axiosResp;
    return ret;
  }

  protected createGenericApiResponseObject<OutResp>(
    msg: string
  ): ApiResponse<OutResp> {
    const resp = new ApiResponse<OutResp>();
    resp.isError = true;
    resp.errorData = new ErrorData();
    resp.errorData.displayMessage = msg;
    resp.errorData.apiErrorType = ApiErrorTypeSM.FrameworkException_Log;
    return resp;
  }

  // ─────────────────────────────────────────────────────────────

  private async addCommonHeaders(
    headers: IDictionaryCollection<string, string> | null
  ): Promise<IDictionaryCollection<string, string>> {
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

    return headers;
  }
}
