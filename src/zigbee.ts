import api, { DeviceObserver } from "./zigbee2mqtt/ws-client";
import Request from "./request";
import Config from "./config";
import { GraphI, TouchLinkDevice } from "./zigbee2mqtt/types";

export interface ZigbeeStatusRecord {
    version: string;
    version_firmware: string;
    running: boolean;
    message: string;
}

export const Zigbee = {
    start: async (pairingTime = 254): Promise<void> => api.start(pairingTime),
    stop: async (): Promise<void> => api.stop(),
    startObservingDevices: (deviceObserver: DeviceObserver): void => api.subscribeToDevices(deviceObserver),
    stopObservingDevices: (deviceObserver: DeviceObserver): void => api.unsubscribeFromDevices(deviceObserver),
    update: async (deviceId: string): Promise<void> => api.otaUpdate(deviceId),
    scanTouchlink: async (): Promise<TouchLinkDevice[]> => api.scanTouchLink(),
    networkMap: async (): Promise<GraphI> => api.requestNetworkMap(),
    setZigbeeChannel: async (channel: number): Promise<void> => api.setZigbeeChannel(channel),
    setZigbeeTransmitPower: async (channel: number): Promise<void> => api.setZigbeeTransmitPower(channel),
    status: async () => <ZigbeeStatusRecord>(await Request.get(`${Config.host.get()}/zigbee`, { headers: { authorization: Config.token.authorization } })).data || {},
};
