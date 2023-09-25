import * as voca from 'voca';

type EventIsModel = {
    eventTypeName: string;
    eventFilename: string;
    isFunctionName: string;
    eventEnumFieldName: string;
};

export const buildModel_eventIs = (eventName: string): EventIsModel => ({
    eventTypeName: `${voca.titleCase(eventName)}_V1`,
    eventFilename: `${voca.titleCase(eventName)}_V1.event`,
    isFunctionName: `is${voca.titleCase(eventName)}_V1`,
    eventEnumFieldName: `${voca.titleCase(eventName)}_V1`,
});
