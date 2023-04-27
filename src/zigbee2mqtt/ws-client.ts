import ReconnectingWebSocket from "reconnecting-websocket";
import keyBy from "lodash/keyBy";
import { CloseEvent } from "reconnecting-websocket/dist/events";
import {
    TouchLinkDevice, Device, IEEEEAddress,
} from "./types";
import {
    randomString, stringifyWithPreservingUndefinedAsNull,
} from "./utils";
import config from "../config";

const UNAUTHORIZED_ERROR_CODE = 4401;

interface Message {
    topic: string;
    payload: string | Record<string, unknown> | Record<string, unknown>[] | string[];
}

export type Devices = Record<IEEEEAddress, Device>;

export interface ResponseWithStatus {
    status: "ok" | "error";
    data: unknown;
    error?: string;
    transaction?: string;
}
interface Callable {
    (reason?: any): void;
}

export type DeviceObserver = {
    onDevices: (devices: Devices) => void;
    onClose: (reason: Error) => void;
};

class Api {
    socket?: ReconnectingWebSocket;

    requests: Map<string, [Callable, Callable, NodeJS.Timeout | null]> = new Map();

    deviceObservers: Set<DeviceObserver> = new Set();

    transactionNumber = 1;

    transactionRndPrefix: string;

    constructor() {
        this.transactionRndPrefix = randomString(5);
    }

    send = (topic: string, payload: Record<string, unknown> = {}, shouldTimeout = true): Promise<any> => {
        if (!this.socket || this.socket?.readyState === this.socket?.CLOSED) {
            this.connect();
        }

        if (topic.startsWith("bridge/request/")) {
            const transaction = `${this.transactionRndPrefix}-${this.transactionNumber += 1}`;
            const promise = new Promise<void>((resolve, reject) => {
                let timeout = null;
                if (shouldTimeout) {
                    timeout = setTimeout(() => {
                        if (this.requests.has(transaction)) {
                            this.socket?.close();
                            this.requests.delete(transaction);
                            reject(new Error("request timed out"));
                        }
                    }, 5000);
                }
                this.requests.set(transaction, [resolve, reject, timeout]);
            });
            this.socket?.send(stringifyWithPreservingUndefinedAsNull({ topic, payload: { ...payload, transaction } }));
            return promise;
        }
        this.socket?.send(stringifyWithPreservingUndefinedAsNull({ topic, payload }));
        this.closeSocketIfUnused();
        return Promise.resolve();
    };

    urlProvider = () => {
        const hoobsURL = new URL(config.host.get());
        return `ws://${hoobsURL.hostname}:8081?token=${config.zigbeeToMqttToken}`;
    };

    connect(): void {
        this.socket = new ReconnectingWebSocket(this.urlProvider, [], { WebSocket });
        this.socket.addEventListener("message", this.onMessage);
        this.socket.addEventListener("close", this.onClose);
    }

    private processBridgeMessage = (data: Message): void => {
        if (data.topic === "bridge/devices" && this.deviceObservers.size !== 0) {
            const devices = keyBy(data.payload as unknown as Device[], "ieee_address");
            this.deviceObservers.forEach((observer) => {
                observer.onDevices(devices);
            });
        } else if (data.topic.startsWith("bridge/response/")) {
            this.resolvePromises(data.payload as unknown as ResponseWithStatus);
        }
    };

    private resolvePromises(message: ResponseWithStatus): void {
        const { transaction, status, data } = message;
        if (transaction !== undefined && this.requests.has(transaction)) {
            const [resolve, reject, timeout] = this.requests.get(transaction) as [Callable, Callable, NodeJS.Timeout];
            clearTimeout(timeout);
            if (status === "ok" || status === undefined) {
                resolve(data);
            } else {
                reject();
            }
            this.requests.delete(transaction);

            this.closeSocketIfUnused();
        }
    }

    closeSocketIfUnused(): void {
        if (this.requests.size === 0 && this.deviceObservers.size === 0) {
            this.socket?.close();
        }
    }

    private onMessage = (event: MessageEvent): void => {
        let data = {} as Message;
        try {
            data = JSON.parse(event.data) as Message;
            if (data.topic.startsWith("bridge/")) {
                this.processBridgeMessage(data);
            }
        } catch (e) {
            console.error(event.data);
        }
    };

    private onClose = (e: CloseEvent): void => {
        let errorString: string;
        if (e.code === UNAUTHORIZED_ERROR_CODE) {
            errorString = "Unauthorized";
        } else {
            errorString = "Connection closed";
        }
        const error = new Error(errorString);

        this.deviceObservers.forEach((observer) => {
            observer.onClose(error);
        });
        this.requests.forEach(([, reject, timeout]) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            reject(error);
        });

        this.socket?.close();
    };
}
export default new Api();
