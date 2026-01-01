import {
  AdditionalRequestDetails,
  Authentication,
} from "../../models/internal/additional-request-details";
import type { BannerSM } from "../../models/service/app/v1/general/bannerSM";
import { storageService } from "../../store/storageService";
import { BaseApiClient } from "../base/baseApiClient";
import type { CommonResponseCodeHandler } from "../base/helpers/common-response-code-handler.helper";

export class BannerApiClient extends BaseApiClient {
  constructor(handler: CommonResponseCodeHandler) {
    super(storageService, handler);
  }

  async getAllPaginated() {
    return this.GetResponseAsync<null, BannerSM[]>(
      "banner/getall/paginated?skip=0&top=10",
      "GET",
      null,
      new AdditionalRequestDetails<BannerSM[]>(false, Authentication.FALSE)
    );
  }
}
