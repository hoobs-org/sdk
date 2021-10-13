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

const REQUEST_TIMEOUT = 1 * 1000;

export function Sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export async function Wait(saftey?: number): Promise<string> {
    try {
        const results = (<{ [key: string]: any }>(await Request({
            method: "get",
            url: `${Config.host.get()}`,
            timeout: REQUEST_TIMEOUT,
        })).data).version;

        return results;
    } catch (error) {
        if ((saftey || 0) > 50) throw error;
    }

    await Sleep(1000);

    return Wait((saftey || 0) + 1);
}
