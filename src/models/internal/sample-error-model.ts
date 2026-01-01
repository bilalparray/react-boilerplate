import { AppConstants } from "src/app/app-constants";
import { ApiErrorTypeSM } from "../service/foundation/enums/api-error-type-s-m.enum";

export class SampleErrorLogModel extends Error {
  apiErrorType?: ApiErrorTypeSM;
  displayMessage!: string;
  additionalProps!: Map<string, Object>;
  createdOnUTC!: string;

  constructor({
    message,
    displayMessage,
    apiErrorType,
    additionalProps,
    name,
  }: {
    message?: string;
    displayMessage?: string;
    apiErrorType?: ApiErrorTypeSM;
    additionalProps?: Map<string, Object>;
    name?: string;
  }) {
    super(
      message || displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error
    );
    this.name = name || "SampleErrorModel";
    Object.setPrototypeOf(this, SampleErrorLogModel.prototype);

    this.displayMessage =
      displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error;
    this.apiErrorType = apiErrorType;
    this.additionalProps = new Map(Object.entries(additionalProps || {}));
  }
}
