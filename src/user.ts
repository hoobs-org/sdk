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
import { UserRecord } from "./users";

export default async function User(id: number): Promise<UserRecord> {
    const results: UserRecord = <UserRecord>(await Request.get(`${Config.host.get()}/users/${id}`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.update = async (username: string, password: string, name?: string, permissions?: { [key: string]: boolean }): Promise<Record<string, any>> => <Record<string, any>>(
        await Request.post(`${Config.host.get()}/users/${id}`, {
            name: name || username,
            username,
            password,
            permissions,
        }, { headers: { authorization: Config.token.authorization } })).data;

    results.remove = async () => <Record<string, any>>(await Request.delete(`${Config.host.get()}/users/${id}`, { headers: { authorization: Config.token.authorization } })).data;

    return results;
}
