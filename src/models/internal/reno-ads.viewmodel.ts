import { RenoAdsSM } from "../service/app/v1/general/ads/reno-ads-s-m";
import { BaseViewModel } from "./base.viewmodel";

export class RenoAdsViewModel extends BaseViewModel {
  override PageTitle: string = "boiler plate";
  renoads: RenoAdsSM[] = [];
}
