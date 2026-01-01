import {
  AdditionalRequestDetails,
  Authentication,
} from "../../models/internal/additional-request-details";
import type { BannerSM } from "../../models/service/app/v1/general/bannerSM";
import { storageService } from "../../store/storageService";
import { BaseApiClient } from "../base/baseApiClient";
import type { CommonResponseCodeHandler } from "../base/helpers/common-response-code-handler.helper";

export class ProductClient extends BaseApiClient {
  constructor(handler: CommonResponseCodeHandler) {
    super(storageService, handler);
  }

  async getProductById(id: string) {
    return this.GetResponseAsync<null, any>(
      `product/${id}`,
      "GET",
      null,
      new AdditionalRequestDetails<BannerSM[]>(false, Authentication.FALSE)
    );
  }
}
