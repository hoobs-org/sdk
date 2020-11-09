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
import { InstanceRecord } from "./instances";

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export default async function Instance(name: string): Promise<InstanceRecord | undefined> {
    await Wait();

    const id = Sanitize(name);

    if (!name || name === "") return undefined;
    if (id === "api") return undefined;

    const current = (await Request.get(`${API_URL}/instances`, { headers: { authorization: Config.token.authorization } })).data || [];
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

            return (await Request.get(`${API_URL}/plugins/${id}`, { headers: { authorization: Config.token.authorization } })).data;
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

    results.rename = async (value: string): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/instance/${id}`, { name: value }, { headers: { authorization: Config.token.authorization } }));
    };

    results.accessories = async (): Promise<{ [key: string]: any }[]> => {
        await Wait();

        return (await Request.get(`${API_URL}/accessories/${id}`, { headers: { authorization: Config.token.authorization } })).data;
    };

    results.start = async (): Promise<void> => {
        await Wait();

        (await Request.get(`${API_URL}/bridge/${id}/start`, { headers: { authorization: Config.token.authorization } }));
    };

    results.stop = async (): Promise<void> => {
        await Wait();

        (await Request.get(`${API_URL}/bridge/${id}/stop`, { headers: { authorization: Config.token.authorization } }));
    };

    results.restart = async (): Promise<void> => {
        await Wait();

        (await Request.get(`${API_URL}/bridge/${id}/restart`, { headers: { authorization: Config.token.authorization } }));
    };

    results.purge = async (): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/bridge/${id}/purge`, null, { headers: { authorization: Config.token.authorization } }));
    };

    results.cache = async (): Promise<{ [key: string]: any }> => {
        await Wait();

        return (await Request.get(`${API_URL}/cache/${id}`, { headers: { authorization: Config.token.authorization } })).data;
    };

    results.remove = async (): Promise<boolean> => {
        await Wait();

        const updated = (await Request.delete(`${API_URL}/instance/${id}`, { headers: { authorization: Config.token.authorization } })).data || [];

        if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

        return true;
    };

    return results;
}
