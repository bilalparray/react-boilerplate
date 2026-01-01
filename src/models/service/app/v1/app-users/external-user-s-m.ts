import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';
import { ExternalUserTypeSM } from '../../enums/external-user-type-s-m.enum';

export class ExternalUserSM extends SampleServiceServiceModelBase<number> {
    refreshToken!: string;
    clientUserId!: number;
    externalUserType!: ExternalUserTypeSM;
}
