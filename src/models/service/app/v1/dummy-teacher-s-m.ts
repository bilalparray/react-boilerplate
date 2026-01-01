import { SampleServiceServiceModelBase } from '../base/sample-service-service-model-base';

export class DummyTeacherSM extends SampleServiceServiceModelBase<number> {
    firstName!: string;
    lastName!: string;
    emailAddress!: string;
    profilePictureFileId?: number;
}
