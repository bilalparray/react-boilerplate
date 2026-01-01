import { SampleServiceServiceModelBase } from "../../../base/sample-service-service-model-base";
import { TargetPlatformSM } from "../../../enums/target-platform-s-m.enum";

export class RenoAdsSM extends SampleServiceServiceModelBase<number> {
  title!: string;
  description!: string;
  appStoreLink!: string;
  appIcon!: string;
  playStoreLink!: string;
  webLink!: string;
  microsoftStoreLink!: string;
  targetPlatform!: TargetPlatformSM;
}
