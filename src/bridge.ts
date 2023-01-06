/**************************************************************************************************
 * hoobs-sdk                                                                                      *
 * Copyright (C) 2020 HOOBS                                                                       *
 *                                                                                                *
 * This program is free software: you can redistribute it and/or modify                           *
 * it under the terms of the GNU General Public License as published by                           *
 * the Free Software Foundation, either version 3 of the License, or                              *
 * (at your option) any later version.                                                            *
 *                                                                                                *
 * This program is distributed in the hope that it will be useful,                                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  *
 * GNU General Public License for more details.                                                   *
 *                                                                                                *
 * You should have received a copy of the GNU General Public License                              *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.                          *
 **************************************************************************************************/

import Request from "./request";
import Config from "./config";
import Sanitize from "./sanitize";
import { BridgeRecord } from "./bridges";

export enum CommunicationTechnology {
    Matter = "matter",
    Homebridge = "homebridge",
}

export type ZigbeeToMQTTConfig = {
    mqtt: {
        base_topic: string;
        server: string;
        ca: string;
        key: string;
        cert: string;
        user: string;
        password: string;
        client_id: string;
        reject_unauthorized: boolean;
        keepalive: number;
        version: number;
        disable_qos: boolean;
    },
    defaults: {
        exclude: boolean;
        excluded_keys: string[];
        values: {
            property: string;
            exclude: string[];
            include: string[];
        }[]
    },
    exclude_grouped_devices: boolean;
    devices: [
        {
            id: string;
            exclude: boolean;
            excluded_keys: string[];
            values: {
                property: string;
                include: string[];
                exclude: string[];
            }[]
            experimental: string[];
        },
    ],
    platform: string;
    plugin_map: {
        plugin_name: string;
    }
};

export default async function Bridge(name: string): Promise<BridgeRecord | undefined> {
    const id = Sanitize(name);

    if (!name || name === "") return undefined;
    if (id === "hub") return undefined;

    const current = <any>(await Request.get(`${Config.host.get()}/bridges`, { headers: { authorization: Config.token.authorization } })).data || [];
    const index = current.findIndex((n: any) => n.id === id);

    if (index === -1) return undefined;

    const results = current[index];

    results.status = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/bridge/${id}`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.config = {
        get: async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/config/${id}`, { headers: { authorization: Config.token.authorization } })).data,

        update: async (data: { [key: string]: any }): Promise<void> => {
            (await Request.post(`${Config.host.get()}/config/${id}`, data, { headers: { authorization: Config.token.authorization } }));
        },
    };

    results.plugins = {
        list: async (): Promise<{ [key: string]: any }[]> => {
            const response = await Request.get(`${Config.host.get()}/plugins/${id}`, { headers: { authorization: Config.token.authorization } });

            if (!Array.isArray(response.data)) return [];

            return response.data || [];
        },

        install: async (identifier: string): Promise<boolean> => {
            if ((<{ [key: string]: any }>(await Request.put(`${Config.host.get()}/plugins/${id}/${identifier}`, null, { headers: { authorization: Config.token.authorization } })).data || {}).success) return true;

            return false;
        },

        upgrade: async (identifier: string): Promise<boolean> => {
            if ((<{ [key: string]: any }>(await Request.post(`${Config.host.get()}/plugins/${id}/${identifier}`, null, { headers: { authorization: Config.token.authorization } })).data || {}).success) return true;

            return false;
        },

        uninstall: async (identifier: string): Promise<boolean> => {
            if ((<{ [key: string]: any }>(await Request.delete(`${Config.host.get()}/plugins/${id}/${identifier}`, { headers: { authorization: Config.token.authorization } })).data || {}).success) return true;

            return false;
        },
    };

    results.update = async (display: string, autostart: number, pin?: string, username?: string, advertiser?: string, debugging?: boolean): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bridge/${id}`, {
            display,
            autostart,
            pin,
            username,
            advertiser,
            debugging,
        }, { headers: { authorization: Config.token.authorization } }));
    };

    results.ports = async (start: number, end: number): Promise<boolean> => {
        if (!start || Number.isNaN(start)) return false;
        if (start < 1 || start > 65535) return false;

        if (!end || Number.isNaN(end)) return false;
        if (end < 1 || end > 65535) return false;

        if (start > end) return false;

        (await Request.post(`${Config.host.get()}/bridge/${id}/ports`, { start, end }, { headers: { authorization: Config.token.authorization } }));

        return true;
    };

    results.accessories = async (): Promise<{ [key: string]: any }[]> => {
        const response = await Request.get(`${Config.host.get()}/accessories/${id}`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return response.data || [];
    };

    results.start = async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bridge/${id}/start`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.stop = async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bridge/${id}/stop`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.restart = async (): Promise<void> => {
        (await Request.post(`${Config.host.get()}/bridge/${id}/restart`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.cache = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/cache/${id}`, { headers: { authorization: Config.token.authorization } })).data;

    results.purge = async (uuid?: string): Promise<void> => {
        if (uuid) {
            (await Request.delete(`${Config.host.get()}/cache/${id}/purge/${uuid}`, { headers: { authorization: Config.token.authorization } }));
        } else {
            (await Request.delete(`${Config.host.get()}/cache/${id}/purge`, { headers: { authorization: Config.token.authorization } }));
        }
    };

    results.export = async (): Promise<string> => {
        const { filename } = <any>(await Request.get(`${Config.host.get()}/bridge/${id}/export`, { headers: { authorization: Config.token.authorization } })).data;

        return `${Config.host.get("backups")}/${filename}`;
    };

    results.remove = async (): Promise<boolean> => {
        const updated = <any>(await Request.delete(`${Config.host.get()}/bridge/${id}`, { headers: { authorization: Config.token.authorization } })).data || [];

        if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

        return true;
    };

    results.communicationtechnology = {
        get: async (): Promise<CommunicationTechnology | undefined> => {
            const data = <{ technology: string | undefined }>(await Request.get(`${Config.host.get()}/bridge/${id}/communicationtechnology`, { headers: { authorization: Config.token.authorization } })).data;
            if (!data || !data.technology) {
                return undefined;
            }
            return data.technology === "matter" ? CommunicationTechnology.Matter : CommunicationTechnology.Homebridge;
        },
        set: async (technology: CommunicationTechnology) => {
            await Request.put(`${Config.host.get()}/bridge/${id}/communicationtechnology`, {
                technology,
            }, { headers: { authorization: Config.token.authorization } });
        },
    };

    results.zigbeeToMqtt = {
        config: {
            load: async (): Promise<ZigbeeToMQTTConfig> => <ZigbeeToMQTTConfig>(
                await Request.get(`${Config.host.get()}/${id}/zigbee/config`, { headers: { authorization: Config.token.authorization } })).data || {},
            save: async (newConfig: ZigbeeToMQTTConfig) => <{ sucess: boolean; message?: string; }>(
                await Request.post(`${Config.host.get()}/${id}/zigbee/config`, newConfig || {}, {
                    headers: { authorization: Config.token.authorization },
                })).data,
        },
    };

    return results;
}
