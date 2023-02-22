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
    async status(): Promise<string> {
        const { state } = <any>(await Request.get(`${Config.host.get()}/auth`, { headers: { authorization: Config.token.authorization } })).data;

        return state;
    },

    async validate(): Promise<boolean> {
        const { valid } = <any>(await Request.get(`${Config.host.get()}/auth/validate`, { headers: { authorization: Config.token.authorization } })).data;

        return valid;
    },

    async disable(): Promise<void> {
        await Request.post(`${Config.host.get()}/auth/disable`);
    },

    async login(username: string, password: string, remember?: boolean): Promise<boolean> {
        const { token, zigbeeToMqttToken } = <any>(await Request.post(`${Config.host.get()}/auth/logon`, { username, password, remember })).data;

        if (token) {
            Config.token.authorization = token;
            Config.zigbeeToMqttToken = zigbeeToMqttToken;

            return true;
        }

        return false;
    },

    async logout(): Promise<void> {
        await Request.get(`${Config.host.get()}/auth/logout`, { headers: { authorization: Config.token.authorization } });

        Config.token.authorization = "";
    },

    get terminal() {
        return {
            async reset(): Promise<void> {
                await Request.delete(`${Config.host.get()}/auth/terminal/reset`, { headers: { authorization: Config.token.authorization } });
            },

            async chpasswd(username: string, password: string): Promise<void> {
                await Request.post(`${Config.host.get()}/auth/terminal/chpasswd`, { username, password }, { headers: { authorization: Config.token.authorization } });
            },
        };
    },
};
