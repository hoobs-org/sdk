import Request from "./request";
import Config from "./config";

export interface BlueZStatusRecord {
    version: string;
    version_firmware: string;
    running: Boolean
    message: string;
  }

export const BlueZ = {
    status: async () => {
        return <BlueZStatusRecord>(await Request.get(`${Config.host.get()}/bluez`, { headers: { authorization: Config.token.authorization } })).data || {}
    },
    start: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bluez/start`, null, { headers: { authorization: Config.token.authorization } }));
    },
    stop: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bluez/stop`, null, { headers: { authorization: Config.token.authorization } }));
    },
    restart: async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bluez/restart`, null, { headers: { authorization: Config.token.authorization } }));
    }
}