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
import { Wait } from "./wait";

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export default {
    async list(): Promise<{ [key: string]: any }[]> {
        await Wait();

        const response = await Request.get(`${API_URL}/extentions`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return response.data || [];
    },

    async add(name: string): Promise<boolean> {
        await Wait();

        (await Request.put(`${API_URL}/extentions/${name}`, null, { headers: { authorization: Config.token.authorization } }));

        const current = (await Request.get(`${API_URL}/extentions`, { headers: { authorization: Config.token.authorization } })).data || [];

        return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) >= 0);
    },

    async remove(name: string): Promise<boolean> {
        await Wait();

        (await Request.delete(`${API_URL}/extentions/${name}`, { headers: { authorization: Config.token.authorization } }));

        const current = (await Request.get(`${API_URL}/extentions`, { headers: { authorization: Config.token.authorization } })).data || [];

        return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) === -1);
    },
};
