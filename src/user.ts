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
import { UserRecord } from "./users";

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export default async function User(id: number): Promise<UserRecord> {
    await Wait();

    const results: UserRecord = (await Request.get(`${API_URL}/users/${id}`, { headers: { authorization: Config.token.authorization } })).data;

    results.update = async (username: string, password: string, name?: string, permissions?: { [key: string]: boolean }): Promise<void> => {
        await Wait();

        (await Request.post(`${API_URL}/users/${id}`, {
            name: name || username,
            username,
            password,
            permissions,
        }, { headers: { authorization: Config.token.authorization } }));
    };

    results.remove = async () => {
        await Wait();

        (await Request.delete(`${API_URL}/users/${id}`, { headers: { authorization: Config.token.authorization } }));
    };

    return results;
}
