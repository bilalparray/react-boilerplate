import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';

export class ApplicationFileSM extends SampleServiceServiceModelBase<number> {
    fileName!: string;
    fileType!: string;
    fileDescription!: string;
    fileBytes!: string;
}
