import { SampleServiceServiceModelBase } from '../base/sample-service-service-model-base';

export class DummySubjectSM extends SampleServiceServiceModelBase<number> {
    subjectName!: string;
    subjectCode!: string;
    dummyTeacherID?: number;
}
