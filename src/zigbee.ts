import Request from "./request";
import Config from "./config";

export interface ZigbeeStatusRecord {
    version: string;
    version_firmware: string;
    running: Boolean
    message: string;
  }

export const Zigbee = {
    status: async () => {
        return <ZigbeeStatusRecord>(await Request.get(`${Config.host.get()}/zigbee`, { headers: { authorization: Config.token.authorization } })).data || {}
    },
    start: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/zigbee/start`, null, { headers: { authorization: Config.token.authorization } }));
    },
    stop: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/zigbee/stop`, null, { headers: { authorization: Config.token.authorization } }));
    },
    restart: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/zigbee/restart`, null, { headers: { authorization: Config.token.authorization } }));
    }
}