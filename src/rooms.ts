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

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export interface RoomRecord {
    id: string;
    name?: string;
    types: [string];
    characteristics: [string];
}

export const Rooms = {
    async count(): Promise<number> {
        const response = await Request.get(`${API_URL}/accessories`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return 0;

        return response.data.length;
    },

    async list(): Promise<RoomRecord[]> {
        const response = await Request.get(`${API_URL}/rooms`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return <RoomRecord[]>response.data;
    },

    async add(name: string, sequence?: number): Promise<boolean> {
        const results = (await Request.put(`${API_URL}/room`, {
            name,
            sequence: sequence || 0,
        }, { headers: { authorization: Config.token.authorization } })).data || {};

        if (results.error) return false;
        if (results.id === Sanitize(name)) return true;

        return false;
    },
};
