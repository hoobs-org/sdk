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

export default {
    get: async (): Promise<{ [key: string]: any }> => (<{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system/hostname`, { headers: { authorization: Config.token.authorization } })).data).hostname,

    update: async (hostname: string): Promise<Record<string, any>> => (<Record<string, any>>(
        await Request.post(`${Config.host.get()}/system/hostname`, { hostname }, { headers: { authorization: Config.token.authorization } })
    ).data),
};
