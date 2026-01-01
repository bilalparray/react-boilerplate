import { BaseViewModel } from "../../internal/base.viewmodel";
import { ForgotPasswordSM } from "../../service/app/v1/app-users/forgot-password-s-m";

export class ForgotPasswordViewModel extends BaseViewModel {
  override PageTitle: string = "Sample";
  forgotPasswordSM = new ForgotPasswordSM();
  isLinkSent: boolean = false;
}
