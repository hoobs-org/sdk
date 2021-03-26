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

let API_URL = "";

if (typeof process !== "undefined") API_URL = process.env.API_URL || process.env.VUE_APP_API || "";

let GET_TOKEN: () => string = () => "";
let SET_TOKEN: (token: string) => void = () => { /* null */ };
let GET_HOST: string = API_URL;

interface SetupToken {
    token: string;
    host: string;
    port: number;
}

export default {
    token: {
        get authorization() {
            return GET_TOKEN();
        },

        set authorization(value: string) {
            SET_TOKEN(value);
        },

        get(callback: () => string) {
            GET_TOKEN = callback;
        },

        set(callback: (token: string) => void) {
            SET_TOKEN = callback;
        },
    },

    host: {
        get(folder?: string): string {
            return `${GET_HOST}/${folder || "api"}`;
        },

        set(host: string, port?: number) {
            GET_HOST = `http://${host}:${port && port >= 1 && port <= 65535 ? port : 80}`;
        },
    },

    setup(token: string) {
        const data:SetupToken = JSON.parse(atob(decodeURIComponent(token)));

        GET_TOKEN = () => data?.token || "";
        GET_HOST = `http://${data.host}:${data.port && data.port >= 1 && data.port <= 65535 ? data.port : 80}`;
    },

    get: async (): Promise<{ [key: string]: any }> => (await Request.get(`${GET_HOST}/api/config?timestamp=${new Date().getTime()}`, { headers: { authorization: GET_TOKEN() } })).data,

    update: async (data: { [key: string]: any }): Promise<void> => {
        (await Request.post(`${GET_HOST}/api/config`, data, { headers: { authorization: GET_TOKEN() } }));
    },
};
