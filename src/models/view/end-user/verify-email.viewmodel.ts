import { BaseViewModel } from "../../internal/base.viewmodel";
import { VerifyEmailRequestSM } from "../../service/app/v1/app-users/verify-email-request-s-m";
export class VerifyEmailViewModel extends BaseViewModel {
  override PageTitle: string = "Sample";
  VerifyEmailRequestSm = new VerifyEmailRequestSM();
  isVerified = false;
}
