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

let API_URL = "";

if (typeof process !== "undefined") API_URL = process.env.API_URL || process.env.VUE_APP_API || "";

let GET_TOKEN: () => string = () => "";
let SET_TOKEN: (token: string) => void = () => { /* null */ };
let GET_HOST: string = API_URL;

let RESTRICT_BRIDGE: string | undefined;
let RESTRICT_PLUGIN: string | undefined;

interface SetupToken {
    token: string;
    host: string;
    port: number;
    bridge?: string;
    plugin?: string;
}

function search() {
    const query: { [key: string]: string | undefined }[] = ((window.location.search || "").replace("?", "").split("&").map((entry) => {
        const pairs = entry.split("=");
        const key = pairs.shift();
        const value = pairs.shift();

        return {
            key,
            value,
        };
    }));

    const results: { [key: string]: string | undefined } = {};

    for (let i = 0; i < query.length; i += 1) {
        const { key } = query[i];
        const { value } = query[i];

        if (key && key !== "") results[key] = value;
    }

    return results;
}

export default {
    token: {
        get authorization() {
            return (typeof GET_TOKEN === "function") ? GET_TOKEN() : "";
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

        domain(): string {
            return (GET_HOST.split("/")[2] || "").split(":").shift() || "";
        },

        set(host: string, port?: number) {
            GET_HOST = `http://${host}:${port && port >= 1 && port <= 65535 ? port : 80}`;
        },
    },

    setup() {
        const query = search();

        if (query.token) {
            const data:SetupToken = JSON.parse(atob(decodeURIComponent(query.token)));

            GET_TOKEN = () => data.token || "";
            GET_HOST = `http://${data.host}:${data.port && data.port >= 1 && data.port <= 65535 ? data.port : 80}`;

            if (data.bridge) RESTRICT_BRIDGE = data.bridge;
            if (data.plugin) RESTRICT_PLUGIN = data.plugin;
        }
    },

    get: async (): Promise<{ [key: string]: any }> => {
        if (RESTRICT_BRIDGE && RESTRICT_PLUGIN) {
            const config = (await Request.get(`${GET_HOST}/api/config/${RESTRICT_BRIDGE}`, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } })).data;
            const platform = ((config || {}).platforms || []).find((item: { [key: string]: any }) => ((item || {}).plugin_map || {}).plugin_name === RESTRICT_PLUGIN) || {};

            delete platform.plugin_map;

            return platform;
        }

        let results: any;

        if (RESTRICT_BRIDGE) {
            results = (await Request.get(`${GET_HOST}/api/config/${RESTRICT_BRIDGE}`, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } })).data;
        } else {
            results = (await Request.get(`${GET_HOST}/api/config?timestamp=${new Date().getTime()}`, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } })).data;
        }

        return results;
    },

    update: async (data: { [key: string]: any }): Promise<void> => {
        if (RESTRICT_BRIDGE && RESTRICT_PLUGIN) {
            const config = (await Request.get(`${GET_HOST}/api/config/${RESTRICT_BRIDGE}`, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } })).data;
            const index = ((config || {}).platforms || []).findIndex((item: { [key: string]: any }) => ((item || {}).plugin_map || {}).plugin_name === RESTRICT_PLUGIN);

            data.plugin_map = {
                plugin_name: RESTRICT_PLUGIN,
            };

            if (index >= 0) {
                config.platforms[index] = data;
            }

            (await Request.post(`${GET_HOST}/api/config/${RESTRICT_BRIDGE}`, config, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } }));
            return;
        }

        if (RESTRICT_BRIDGE) {
            (await Request.post(`${GET_HOST}/api/config/${RESTRICT_BRIDGE}`, data, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } }));
            return;
        }

        (await Request.post(`${GET_HOST}/api/config`, data, { headers: { authorization: (typeof GET_TOKEN === "function") ? GET_TOKEN() : "" } }));
    },
};
