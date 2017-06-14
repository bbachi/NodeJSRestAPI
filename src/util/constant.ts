export const BASE_SDL_ODATA_SERV_URL = 'http://txaixebxindxd01:13180/cd-service/gme/cdws/odata.svc'
export const CUSTOM_META = "/CustomMetas()";
export const AND = "&";
export const OR = "or";
export const FILTER = "$filter=";
export const EXPAND = "$expand=";
export const STRING_VALUE = "StringValue eq ";
export const COMPONENT = "Component";
export const PRESENTATION_CONTENT = "/PresentationContent";
export const SDL_RESPONSE_FORMAT = "$format=json"
export const COMPONENT_PRESENTATIONS = "/ComponentPresentations";
export const KEY_NAME_PRIORITY = "KeyName eq 'priority'";
export const KEY_NAME_REGION = "KeyName eq 'region'";
export const COMPONENTS = "/Components";
export const KEY_NAME = "KeyName eq ";
export const REGION = "region";
export const YES = "Yes";
export const OVERRIDE_URL = BASE_SDL_ODATA_SERV_URL+CUSTOM_META+"?"+FILTER+KEY_NAME+"'override' and "+STRING_VALUE+"'Yes'"+AND+EXPAND+COMPONENT+AND+SDL_RESPONSE_FORMAT;
export const DEFAULT_URL = BASE_SDL_ODATA_SERV_URL+CUSTOM_META+"?"+FILTER+STRING_VALUE+"'Default'"+AND+EXPAND+COMPONENT+AND+SDL_RESPONSE_FORMAT;
export const REG_INTERSTITIAL = "Interstitial";
export const REG_DASHBOARD = "Dashboard";
export const KEY_OVERRIDE = 'override';
export const ENVIRONMENT_CONFIG = {
    "imageHost":process.env.GME_HOST_INFO
};

//publication ids for multible brands
export enum PUBLISH_ID {
    GME_PUB_ID_EN = 123,
    GME_PUB_ID_ES = 124,
    REL_PUB_ID_EN = 84,
    REL_PUB_ID_ES = 101
}