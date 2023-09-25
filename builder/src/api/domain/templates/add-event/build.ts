import * as voca from 'voca';

type EventBuildModel = {
    functionName: string;
    eventDataTypeName: string;
    eventTypeName: string;
    eventFilename: string;
    eventEnumFieldName: string;
};

export const buildModel_eventBuild = (eventName: string): EventBuildModel => ({
    functionName: `build${voca.titleCase(eventName)}V1`,
    eventDataTypeName: `${voca.titleCase(eventName)}Data_V1`,
    eventTypeName: `${voca.titleCase(eventName)}_V1`,
    eventFilename: `${voca.titleCase(eventName)}_V1.event`,
    eventEnumFieldName: `${voca.titleCase(eventName)}_V1`,
});
