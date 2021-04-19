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

export default async function Accessory(bridge: string, id: string): Promise<{ [key: string]: any }> {
    const results = (await Request.get(`${Config.host.get()}/accessory/${bridge}/${id}`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.set = async (characteristic: string, data: { [key: string]: any }): Promise<void> => {
        (await Request.put(`${Config.host.get()}/accessory/${bridge}/${id}/${characteristic}`, { value: data }, { headers: { authorization: Config.token.authorization } }));
    };

    if (results.type === "camera") {
        results.stream = () => `${Config.host.get()}/accessory/${bridge}/${id}/stream`;

        results.snapshot = async (): Promise<string | undefined> => {
            const { image } = (await Request.get(`${Config.host.get()}/accessory/${bridge}/${id}/snapshot`, { headers: { authorization: Config.token.authorization } })).data;

            if (!image) return undefined;

            return image;
        };
    }

    return results;
}
