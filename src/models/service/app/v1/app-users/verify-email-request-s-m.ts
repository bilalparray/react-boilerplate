import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';

export class VerifyEmailRequestSM extends SampleServiceServiceModelBase<number> {
    authCode!: string;
}
