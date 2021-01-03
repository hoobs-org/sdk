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

export interface UserRecord {
    id: number;
    name: string;
    permissions: { [key: string]: boolean };
    username: string;
    update?: (username: string, password: string, name?: string, permissions?: { [key: string]: boolean }) => Promise<void>;
    remove?: () => Promise<void>;
}

export const Users = {
    async list(): Promise<UserRecord[]> {
        await Wait();

        const response = await Request.get(`${API_URL}/users`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        return response.data || [];
    },

    async add(username: string, password: string, name?: string, permissions?: { [key: string]: boolean }): Promise<UserRecord[]> {
        await Wait();

        return (await Request.put(`${API_URL}/users`, {
            name: name || username,
            username,
            password,
            permissions,
        }, { headers: { authorization: Config.token.authorization } })).data;
    },
};
