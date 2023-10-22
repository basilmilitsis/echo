import * as voca from 'voca';

type EventIsModel = {
    eventTypeName: string;
    eventFilename: string;
    eventDataTypename: string;
    isFunctionName: string;
    eventEnumFieldName: string;
};

export const buildModel_eventIs = (eventName: string): EventIsModel => ({
    eventTypeName: `${voca.titleCase(eventName)}_V1`,
    eventFilename: `${voca.titleCase(eventName)}_V1.event`,
    eventDataTypename: `${voca.titleCase(eventName)}Data_V1`,
    isFunctionName: `is${voca.titleCase(eventName)}_V1`,
    eventEnumFieldName: `${voca.titleCase(eventName)}_V1`,
});
