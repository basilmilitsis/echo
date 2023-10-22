import * as voca from 'voca';

type EventModel = {
    eventDataTypeName: string;
    eventTypeName: string;
    eventEnumFieldName: string;
    buildFunctionName: string;
    isFunctionName: string;
};

export const buildModel_event = (eventName: string): EventModel => ({
    eventDataTypeName: `${voca.titleCase(eventName)}Data_V1`,
    eventTypeName: `${voca.titleCase(eventName)}_V1`,
    eventEnumFieldName: `${voca.titleCase(eventName)}_V1`,
    buildFunctionName: `build${voca.titleCase(eventName)}_V1`,
    isFunctionName: `is${voca.titleCase(eventName)}_V1`,
});
