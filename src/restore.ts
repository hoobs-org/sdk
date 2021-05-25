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
    async file(file: string): Promise<void> {
        await Request.get(`${Config.host.get()}/system/restore?filename=${encodeURIComponent(file)}`, { headers: { authorization: Config.token.authorization } });
    },

    async upload(file: Blob): Promise<void> {
        const form = new FormData();

        form.append("file", file);

        (await Request.post(`${Config.host.get()}/system/restore`, form, { headers: { authorization: Config.token.authorization } }));
    },
};
