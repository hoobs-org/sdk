import debounce from "lodash/debounce";
import {
    GraphI, LinkI, LinkType, NodeI, Device, DeviceState, Endpoint, Group, LastSeenType, Z2MConfig,
} from "./types";

export const genDeviceDetailsLink = (deviceIdentifier: string | number): string => (`/device/${deviceIdentifier}`);

export const toHex = (input: number, padding = 4): string => {
    const padStr = "0".repeat(padding);
    return `0x${(padStr + input.toString(16)).slice(-1 * padding).toUpperCase()}`;
};

export const toHHMMSS = (secs: number): string => {
    if (!secs) {
        return "N/A";
    }
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor(secs / 60) % 60;
    const seconds = Math.floor(secs % 60);

    return [hours, minutes, seconds]
        .map((v) => (v < 10 ? `0${v}` : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
};

export type CallbackHandler<T> = (err: boolean, res: T) => void;
export interface ApiResponse<T> {
    success: boolean;
    result: T;
}

export const lastSeen = (state: DeviceState, lastSeenType: LastSeenType): Date | undefined => {
    if (!state.last_seen) {
        return undefined;
    }
    switch (lastSeenType) {
        case "ISO_8601":
        case "ISO_8601_local":
            return new Date(Date.parse(state.last_seen as string));

        case "epoch":
            return new Date(state.last_seen as number);

        case "disable":
            return undefined;

        default:
            console.warn(`Unknown last_seen type ${lastSeenType}`);
            return undefined;
    }
};

export function padTo2Digits(num: number): string {
    return num.toString().padStart(2, "0");
}

export function formatDate(date: Date): string {
    return (
        `${[
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join("-")
        } ${
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join(":")}`
    );
}

export const sanitizeGraph = (inGraph: GraphI): GraphI => {
    const nodes: { [key: string]: NodeI } = {};
    const links = new Map<string, LinkI>();

    inGraph.nodes.forEach((node) => {
        nodes[node.ieeeAddr] = node;
    });

    inGraph.links.sort((a, b) => a.relationship - b.relationship);
    inGraph.links.forEach((link) => {
        const src: NodeI = nodes[link.source.ieeeAddr];
        const dst: NodeI = nodes[link.target.ieeeAddr];

        if (src && dst) {
            const linkId = [link.source.ieeeAddr, link.target.ieeeAddr].sort().join("");
            const repeatedLink = links.get(linkId);
            const linkType = [src.type, dst.type].join("2") as LinkType;
            if (repeatedLink) {
                repeatedLink.linkqualities.push(link.linkquality);
                repeatedLink.relationships.push(link.relationship);
            } else {
                links.set(linkId, {
                    ...link,
                    ...{
                        source: src, target: dst, linkType, linkqualities: [link.linkquality], relationships: [link.relationship],
                    },
                });
            }
        } else {
            console.warn(`Broken link${src ? "" : " ,source node is missing"}${dst ? "" : " ,target node is missing"}`, link);
        }
    });

    inGraph.links = Array.from(links.values());
    return inGraph;
};

export const getDeviceDisplayName = (device: Device): string => {
    const model = device.definition?.model ? `(${device.definition?.model})` : "";
    return `${device.friendly_name} ${model}`;
};

export const randomString = (len: number): string => Math.random().toString(36).slice(2, 2 + len);

export const scale = (inputY: number, yRange: Array<number>, xRange: Array<number>): number => {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;

    const percent = (inputY - yMin) / (yMax - yMin);
    return percent * (xMax - xMin) + xMin;
};

export const sanitizeZ2MDeviceName = (deviceName?: string): string => (deviceName ? deviceName.replace(/:|\s|\//g, "-") : "NA");

export const getEndpoints = (obj: Device | Group): Endpoint[] => {
    let eps: Endpoint[] = [];
    if (!obj) {
        return eps;
    } if ((obj as Device).endpoints) {
        eps = eps.concat(Object.keys((obj as Device).endpoints) as Endpoint[]);
    } else if ((obj as Group).members) {
        eps = eps.concat((obj as Group).members.map((g) => g.endpoint));
    }
    if ((obj as Device).definition?.exposes) {
        eps = eps.concat((obj as Device).definition?.exposes?.map((e) => e.endpoint).filter(Boolean) as Endpoint[]);
    }
    return eps;
};

export const isDeviceDisabled = (device: Device, config: Z2MConfig): boolean => !!(config.device_options?.disabled || config.devices[device.ieee_address]?.disabled);

export const stringifyWithPreservingUndefinedAsNull = (data: Record<string, unknown>): string => JSON.stringify(data, (k, v) => (v === undefined ? null : v));

// eslint-disable-next-line no-bitwise
export const isOnlyOneBitIsSet = (b: number): number | boolean => b && !(b & (b - 1));

/* eslint-disable */
export const debounceArgs = (fn: (...args: any) => any, options?: Record<string, any>) => {
    let __dbArgs: any[] = [];

    const __dbFn = debounce(() => {
        fn.call(undefined, __dbArgs);
        __dbArgs = [];
    }, undefined, options);
    return (...args: any) => {
        __dbArgs.push(...args);
        __dbFn();
    };
};
/* eslint-enable */

export const isIframe = (): boolean => window.location !== window.parent.location;
