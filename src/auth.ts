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

const API_URL = process.env.API_URL || process.env.VUE_APP_API || "/api";

export default {
    async status(): Promise<string> {
        return (await Request.get(`${API_URL}/auth`, { headers: { authorization: Config.token.authorization } })).data.state;
    },

    async validate(): Promise<boolean> {
        return (await Request.get(`${API_URL}/auth/validate`, { headers: { authorization: Config.token.authorization } })).data.valid;
    },

    async disable(): Promise<void> {
        await Request.post(`${API_URL}/auth/disable`);
    },

    async login(username: string, password: string, remember?: boolean): Promise<boolean> {
        const { token } = (await Request.post(`${API_URL}/auth/logon`, { username, password, remember })).data;

        if (token) {
            Config.token.authorization = token;

            return true;
        }

        return false;
    },

    async link(vendor: string, username: string, password: string, verification?: string) {
        return (await Request.post(`${API_URL}/auth/vendor/${vendor}`, { username, password, verification }, { headers: { authorization: Config.token.authorization } })).data;
    },

    async logout(): Promise<void> {
        await Request.get(`${API_URL}/auth/logout`, { headers: { authorization: Config.token.authorization } });

        Config.token.authorization = "";
    },
};
