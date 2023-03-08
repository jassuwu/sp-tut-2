// export const BACKEND_URL = "http://localhost:5000";
export const BACKEND_URL = "";

export const API_URL = BACKEND_URL + "/api";

const CALENDAR_ENDPOINT = API_URL + "/calendar";
export const CALENDAR_ALL_CREATE = CALENDAR_ENDPOINT + "/";
export const CALENDAR_ONE_UPDATE_DELETE = CALENDAR_ENDPOINT + "/:year";

const PLANNER_ENDPOINT = CALENDAR_ENDPOINT + "/:year/planner";
export const PLANNER_ALL_CREATE = PLANNER_ENDPOINT + "/";
export const PLANNER_ONE_UPDATE_DELETE = PLANNER_ENDPOINT + "/:id";

const ACTIVITY_ENDPOINT = PLANNER_ENDPOINT + "/:id/activity";
export const ACTIVITY_UPDATE_ORDER = ACTIVITY_ENDPOINT + "/order";
export const ACTIVITY_ALL_CREATE = ACTIVITY_ENDPOINT + "/";
export const ACTIVITY_ONE_UPDATE_DELETE = ACTIVITY_ENDPOINT + "/:activity_id";

const TEMPLATE_ENDPOINT = API_URL + "/template";
export const TEMPLATE_ALL_CREATE = TEMPLATE_ENDPOINT + "/";
export const TEMPLATE_ONE_UPDATE_DELETE = TEMPLATE_ENDPOINT + "/:id";
