import Request from "./request";
import Config from "./config";

export interface ThreadStatusRecord {
    version: string;
    version_firmware: string;
    running: boolean;
    message: string;
}

export const Thread = {
    status: async () => <ThreadStatusRecord>(await Request.get(`${Config.host.get()}/thread`, { headers: { authorization: Config.token.authorization } })).data || {},
    start: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/thread/start`, null, { headers: { authorization: Config.token.authorization } }));
    },
    stop: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/thread/stop`, null, { headers: { authorization: Config.token.authorization } }));
    },
    restart: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/thread/restart`, null, { headers: { authorization: Config.token.authorization } }));
    },
};
