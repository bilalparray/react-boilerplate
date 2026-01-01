import type { AxiosResponse } from "axios";
import type { IDictionaryCollection } from "./Idictionary-collection";
import type { ApiResponse } from "../service/foundation/api-contracts/base/api-response";

export type Authentication = "TRUE" | "FALSE" | "AUTOMATION_TOKEN";

export const Authentication = {
  TRUE: "TRUE" as Authentication,
  FALSE: "FALSE" as Authentication,
  AUTOMATION_TOKEN: "AUTOMATION_TOKEN" as Authentication,
};

export class AdditionalRequestDetails<OutResp> {
  enableAuth: Authentication;
  useCacheIfPossible = false;
  forceGetResponseFromApi = false;
  headers: IDictionaryCollection<string, string> | null = null;
  contentType = "application/json";
  custRespResolver: ((resp: AxiosResponse) => ApiResponse<OutResp>) | null =
    null;

  constructor(
    useCacheIfPossible: boolean,
    enableAuth: Authentication = Authentication.TRUE
  ) {
    this.useCacheIfPossible = useCacheIfPossible;
    this.enableAuth = enableAuth; // ← THIS was missing
  }
}
