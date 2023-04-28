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

type EthernetConfig = {
    link: boolean;
    ipv4: string;
    ipv6: string;
    netmask: string;
    gateway: string;
    speed: number;
    dns: string[];
};

export default async function System(): Promise<{ [key: string]: any }> {
    const results = <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.cpu = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system/cpu`, { headers: { authorization: Config.token.authorization } })).data;

    results.memory = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system/memory`, { headers: { authorization: Config.token.authorization } })).data;

    results.network = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system/network`, { headers: { authorization: Config.token.authorization } })).data;

    results.filesystem = async (): Promise<{ [key: string]: any }> => <any>(await Request.get(`${Config.host.get()}/system/filesystem`, { headers: { authorization: Config.token.authorization } })).data;

    results.activity = async (): Promise<{ [key: string]: any }> => <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/system/activity`, { headers: { authorization: Config.token.authorization } })).data;

    results.temp = async (): Promise<{ [key: string]: any } | undefined> => {
        const info = <any>(await Request.get(`${Config.host.get()}/system/temp`, { headers: { authorization: Config.token.authorization } })).data;

        if (info.main === -1) return undefined;

        return info;
    };

    results.updates = async (): Promise<{ [key: string]: any }> => {
        const status = <{ [key: string]: any }>(await Request.get(`${Config.host.get()}/status/updates`, { headers: { authorization: Config.token.authorization } })).data;

        return status;
    };

    results.upgrade = async (): Promise<Record<string, any>> => <Record<string, any>>(await Request.post(`${Config.host.get()}/system/upgrade`, null, { headers: { authorization: Config.token.authorization } })).data;

    results.reboot = async (): Promise<Record<string, any>> => <Record<string, any>>(await Request.put(`${Config.host.get()}/system/reboot`, null, { headers: { authorization: Config.token.authorization } })).data;

    results.shutdown = async (): Promise<Record<string, any>> => <Record<string, any>>(await Request.put(`${Config.host.get()}/system/shutdown`, null, { headers: { authorization: Config.token.authorization } })).data;

    results.reset = async (): Promise<Record<string, any>> => <Record<string, any>>(await Request.put(`${Config.host.get()}/system/reset`, null, { headers: { authorization: Config.token.authorization } })).data;

    results.purge = async (): Promise<Record<string, any>> => <Record<string, any>>(await Request.delete(`${Config.host.get()}/cache/purge`, { headers: { authorization: Config.token.authorization } })).data;

    results.firmware = async (): Promise<{ [key: string]: any }> => (await <{ [key: string]: any }>(Request.get(
        `${Config.host.get()}/system/firmware`, { headers: { authorization: Config.token.authorization } },
    ))).data || {};

    results.ethernet = async (): Promise<EthernetConfig> => <EthernetConfig>(await Request.get(`${Config.host.get()}/system/ethernet`, { headers: { authorization: Config.token.authorization } })).data;

    return results;
}
