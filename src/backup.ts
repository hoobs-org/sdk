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
    async execute(): Promise<string> {
        const { filename } = <any>(await Request.get(`${Config.host.get()}/system/backup`, { headers: { authorization: Config.token.authorization } })).data;

        return `${Config.host.get("backups")}/${filename}`;
    },

    async catalog(count?: number): Promise<{ [key: string]: any }[]> {
        const response = await Request.get(`${Config.host.get()}/system/backup/catalog`, { headers: { authorization: Config.token.authorization } });

        if (!Array.isArray(response.data)) return [];

        const list = (response.data || []).reverse();

        if ((count || 5) <= 0) return list;

        return list.slice(0, (count || 5));
    },
};
