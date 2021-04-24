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

import Request from "axios";
import Config from "./config";
import Sanitize from "./sanitize";

export interface BridgeRecord {
    id: string;
    type: string;
    display: string;
    port: number;
    pin?: string;
    username?: string;
    ports?: { [key: string]: number };
    autostart?: number;
    host?: string;
    service?: string;
    status?: () => Promise<{ [key: string]: any }>;
    config?: { [key: string]: any };
    plugins?: () => Promise<{ [key: string]: any }[]> | string;
    plugin?: { [key: string]: any };
    rename?: () => Promise<void>;
    accessories?: () => Promise<{ [key: string]: any }[]>;
    start?: () => Promise<void>;
    stop?: () => Promise<void>;
    restart?: () => Promise<void>;
    purge?: () => Promise<void>;
    cache?: () => Promise<{ [key: string]: any }>;
    remove?: () => Promise<boolean>;
}

export const Bridges = {
    async count(): Promise<number> {
        const { bridges } = (await Request.get(`${Config.host.get()}/bridges/count`)).data;

        return bridges;
    },

    async list(): Promise<BridgeRecord[]> {
        const response = await Request.get(`${Config.host.get()}/bridges`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return response.data || [];
    },

    async add(name: string, port: number, pin?: string, username?: string, advertiser?: string): Promise<boolean> {
        const current = (await Request.get(`${Config.host.get()}/bridges`, { headers: { authorization: Config.token.authorization } })).data || [];

        if (!port || Number.isNaN(port)) return false;
        if (port < 1 || port > 65535) return false;
        if (current.findIndex((n: any) => n.port === port) >= 0) return false;
        if (current.findIndex((n: any) => n.id === Sanitize(name)) >= 0) return false;

        const results = (await Request.put(`${Config.host.get()}/bridges`, {
            name,
            port,
            pin,
            username,
            advertiser,
        }, { headers: { authorization: Config.token.authorization } })).data || [];

        if (results.findIndex((n: any) => n.id === Sanitize(name)) >= 0) return true;

        return false;
    },

    async import(file: Blob, name: string, port: number, pin?: string, username?: string, advertiser?: string): Promise<void> {
        const form = new FormData();

        form.append("file", file);
        form.append("name", name);
        form.append("port", `${port}`);

        if (pin && pin !== "") form.append("pin", pin);
        if (username && username !== "") form.append("username", username);
        if (advertiser && advertiser !== "") form.append("advertiser", advertiser);

        (await Request.post(`${Config.host.get()}/bridges/import`, form, { headers: { authorization: Config.token.authorization } }));
    },
};
