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

export default async function Plugin(bridge: string, identifier: string, action?: string, data?: { [key: string]: any }): Promise<{ [key: string]: any }[]> {
    data = data || {};
    data.bridge = bridge;

    let results: any;

    if (action && action !== "") {
        results = (await Request.post(`${Config.host.get()}/plugin/${encodeURIComponent(identifier)}/${action}`, data || {}, { headers: { authorization: Config.token.authorization } })).data;
    } else {
        results = (await Request.post(`${Config.host.get()}/plugin/${encodeURIComponent(identifier)}`, data || {}, { headers: { authorization: Config.token.authorization } })).data;
    }

    return results;
}
