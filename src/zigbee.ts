import api, { DeviceObserver, DeviceStateObserver, ResponseWithStatus } from "./zigbee2mqtt/ws-client";
import Request from "./request";
import Config from "./config";
import { GraphI, TouchLinkDevice } from "./zigbee2mqtt/types";
import { sanitizeGraph } from "./zigbee2mqtt/utils";

export interface ZigbeeStatusRecord {
    version: string;
    version_firmware: string;
    running: boolean;
    message: string;
}

interface TouchlinkScanResponse extends ResponseWithStatus {
    data: {
        found: TouchLinkDevice[];
    };
}

export const Zigbee = {
    start: (pairingTime = 254): Promise<void> => api.send("bridge/request/permit_join", { value: true, time: pairingTime }),

    stop: (): Promise<void> => api.send("bridge/request/permit_join", { value: false }),

    subscribeToDevices: (deviceObserver: DeviceObserver): void => {
        api.deviceObservers.add(deviceObserver);
        api.onObserverAttached();
    },

    unsubscribeFromDevices: (deviceObserver: DeviceObserver) => {
        api.deviceObservers.delete(deviceObserver);
        api.closeSocketIfUnused();
    },

    subscribeToDeviceStates: (deviceStateObserver: DeviceStateObserver): void => {
        api.deviceStateObservers.add(deviceStateObserver);
        api.onObserverAttached();
    },

    unsubscribeFromDeviceStates: (deviceStateObserver: DeviceStateObserver) => {
        api.deviceStateObservers.delete(deviceStateObserver);
        api.closeSocketIfUnused();
    },

    removeDevice: (
        dev: string,
        force: boolean,
        block: boolean,
    ): Promise<void> => api.send("bridge/request/device/remove", { id: dev, force, block }),

    otaUpdate: (deviceId: string): Promise<void> => api.send("bridge/request/device/ota_update/update", { id: deviceId }),

    otaCheckDevice: (deviceName: string): Promise<void> => api.send("bridge/request/device/ota_update/check", { id: deviceName }),

    touchlinkScan: (): Promise<TouchLinkDevice[]> => new Promise((resolve, reject) => {
        api.send("bridge/request/touchlink/scan", undefined, false)
            .then((data) => {
                const response = data as unknown as TouchlinkScanResponse;
                resolve(response.data.found);
            })
            .catch(reject);
    }),

    touchlinkIdentify: (device: TouchLinkDevice): Promise<void> => api.send("bridge/request/touchlink/identify", device as unknown as Record<string, unknown>),

    touchlinkReset: (device: TouchLinkDevice): Promise<void> => api.send("bridge/request/touchlink/factory_reset", device as unknown as Record<string, unknown>),

    requestNetworkMap: (): Promise<GraphI> => new Promise((resolve, reject) => {
        api.send("bridge/request/networkmap", { type: "raw", routes: false }, false)
            .then((data) => {
                resolve(sanitizeGraph((data as { value: unknown }).value as GraphI));
            })
            .catch(reject);
    }),

    setZigbeeChannel: (channel: number): Promise<void> => api.send("bridge/request/options", { options: { advanced: { channel } } }),

    setZigbeeTransmitPower: (transmitPower: number): Promise<void> => api.send("bridge/request/options", { options: { advanced: { transmit_power: transmitPower } } }),

    status: async () => <ZigbeeStatusRecord>(await Request.get(`${Config.host.get()}/zigbee`, { headers: { authorization: Config.token.authorization } })).data || {},
};
