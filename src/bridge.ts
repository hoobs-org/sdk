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
import { Wait } from "./wait";
import { BridgeRecord } from "./bridges";

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";
const BACKUPS_URL = process.env.BACKUPS_URL || process.env.VUE_APP_BACKUPS || "/backups";

export default async function Bridge(name: string): Promise<BridgeRecord | undefined> {
    await Wait();

    const id = Sanitize(name);

    if (!name || name === "") return undefined;
    if (id === "hub") return undefined;

    const current = (await Request.get(`${API_URL}/bridges`, { headers: { authorization: Config.token.authorization } })).data || [];
    const index = current.findIndex((n: any) => n.id === id);

    if (index === -1) return undefined;

    const results = current[index];

    results.status = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/bridge/${id}`, { headers: { authorization: Config.token.authorization } })).data;

    results.config = {
        get: async (): Promise<{ [key: string]: any }> => {
            await Wait();

            return (await Request.get(`${API_URL}/config/${id}`, { headers: { authorization: Config.token.authorization } })).data;
        },

        update: async (data: { [key: string]: any }): Promise<void> => {
            await Wait();

            (await Request.post(`${API_URL}/config/${id}`, data, { headers: { authorization: Config.token.authorization } }));
        },
    };

    results.plugins = {
        list: async (): Promise<{ [key: string]: any }[]> => {
            await Wait();

            const response = await Request.get(`${API_URL}/plugins/${id}`, { headers: { authorization: Config.token.authorization } });

            if (!Array.isArray(response.data)) return [];

            return response.data || [];
        },

        install: async (identifier: string): Promise<void> => {
            await Wait();

            (await Request.put(`${API_URL}/plugins/${id}/${identifier}`, null, { headers: { authorization: Config.token.authorization } }));
        },

        upgrade: async (identifier: string): Promise<void> => {
            await Wait();

            (await Request.post(`${API_URL}/plugins/${id}/${identifier}`, null, { headers: { authorization: Config.token.authorization } }));
        },

        uninstall: async (identifier: string): Promise<void> => {
            await Wait();

            (await Request.delete(`${API_URL}/plugins/${id}/${identifier}`, { headers: { authorization: Config.token.authorization } }));
        },
    };

    results.update = async (display: string, autostart: number, pin?: string, username?: string, advertiser?: string): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/bridge/${id}`, {
            display,
            autostart,
            pin,
            username,
            advertiser,
        }, { headers: { authorization: Config.token.authorization } }));
    };

    results.ports = async (start: number, end: number): Promise<boolean> => {
        if (!start || Number.isNaN(start)) return false;
        if (start < 1 || start > 65535) return false;

        if (!end || Number.isNaN(end)) return false;
        if (end < 1 || end > 65535) return false;

        if (end > start) return false;

        (await Request.post(`${API_URL}/bridge/${id}/ports`, { start, end }, { headers: { authorization: Config.token.authorization } }));

        return true;
    };

    results.accessories = async (): Promise<{ [key: string]: any }[]> => {
        await Wait();

        const response = await Request.get(`${API_URL}/accessories/${id}`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return response.data || [];
    };

    results.start = async (): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/bridge/${id}/start`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.stop = async (): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/bridge/${id}/stop`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.restart = async (): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/bridge/${id}/restart`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.cache = async (): Promise<{ [key: string]: any }> => {
        await Wait();

        return (await Request.get(`${API_URL}/cache/${id}`, { headers: { authorization: Config.token.authorization } })).data;
    };

    results.purge = async (uuid?: string): Promise<void> => {
        await Wait();

        if (uuid) {
            (await Request.delete(`${API_URL}/cache/${id}/purge/${uuid}`, { headers: { authorization: Config.token.authorization } }));
        } else {
            (await Request.delete(`${API_URL}/cache/${id}/purge`, { headers: { authorization: Config.token.authorization } }));
        }
    };

    results.export = async (): Promise<string> => {
        await Wait();

        const { filename } = (await Request.get(`${API_URL}/bridge/${id}/export`, { headers: { authorization: Config.token.authorization } })).data;

        return `${BACKUPS_URL}/${filename}`;
    };

    results.remove = async (): Promise<boolean> => {
        await Wait();

        const updated = (await Request.delete(`${API_URL}/bridge/${id}`, { headers: { authorization: Config.token.authorization } })).data || [];

        if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

        return true;
    };

    return results;
}
