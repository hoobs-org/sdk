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

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export default async function System(): Promise<{ [key: string]: any }> {
    const results = (await Request.get(`${API_URL}/system`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.cpu = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/system/cpu`, { headers: { authorization: Config.token.authorization } })).data;

    results.memory = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/system/memory`, { headers: { authorization: Config.token.authorization } })).data;

    results.network = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/system/network`, { headers: { authorization: Config.token.authorization } })).data;

    results.filesystem = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/system/filesystem`, { headers: { authorization: Config.token.authorization } })).data;

    results.activity = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/system/activity`, { headers: { authorization: Config.token.authorization } })).data;

    results.temp = async (): Promise<{ [key: string]: any } | undefined> => {
        const info = (await Request.get(`${API_URL}/system/temp`, { headers: { authorization: Config.token.authorization } })).data;

        if (info.main === -1) return undefined;

        return info;
    };

    results.upgrade = async (): Promise<void> => {
        await Request.post(`${API_URL}/system/upgrade`, null, { headers: { authorization: Config.token.authorization } });
    };

    results.reboot = async (): Promise<void> => {
        await Request.put(`${API_URL}/system/reboot`, null, { headers: { authorization: Config.token.authorization } });
    };

    results.reset = async (): Promise<void> => {
        await Request.put(`${API_URL}/system/reset`, null, { headers: { authorization: Config.token.authorization } });
    };

    results.purge = async (): Promise<void> => {
        await Request.delete(`${API_URL}/cache/purge`, { headers: { authorization: Config.token.authorization } });
    };

    return results;
}
