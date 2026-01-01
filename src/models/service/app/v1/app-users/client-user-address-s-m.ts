import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';

export class ClientUserAddressSM extends SampleServiceServiceModelBase<number> {
    country!: string;
    state!: string;
    city!: string;
    address1!: string;
    address2!: string;
    pinCode!: string;
    clientUserId!: number;
}
