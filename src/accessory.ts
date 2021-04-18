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

const BLANK_IMAGE = [
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV/TSkWqgnYQdchQnSyIijhKFYtgobQVWnUwufRDaNKQpLg4Cq4FBz8Wqw4u",
    "zro6uAqC4AeIm5uToouU+L+k0CLGg+N+vLv3uHsHCPUyU83AOKBqlpGKx8RsbkUMviKAPgQxhB6JmXoivZCB5/i6h4+vd1Ge5X3uz9Gt5E0G+ETiWaYbFvE68fSmpXPeJw6zkqQQnxOPGXRB",
    "4keuyy6/cS46LPDMsJFJzRGHicViG8ttzEqGSjxFHFFUjfKFrMsK5y3OarnKmvfkLwzlteU012kOI45FJJCECBlVbKAMC1FaNVJMpGg/5uEfdPxJcsnk2gAjxzwqUCE5fvA/+N2tWZiccJNC",
    "MaDjxbY/RoDgLtCo2fb3sW03TgD/M3CltfyVOjDzSXqtpUWOgN5t4OK6pcl7wOUOMPCkS4bkSH6aQqEAvJ/RN+WA/luga9XtrbmP0wcgQ10t3QAHh8BokbLXPN7d2d7bv2ea/f0AO8NykaOw",
    "p3oAAAAGYktHRAAAAK0A+eyCP/QAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBBIHHAkfKeo5AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAAxJREFUCNdj",
    "YKATAAAAaQABwB3y+AAAAABJRU5ErkJggg==",
];

export default async function Accessory(bridge: string, id: string): Promise<{ [key: string]: any }> {
    const results = (await Request.get(`${Config.host.get()}/accessory/${bridge}/${id}`, { headers: { authorization: Config.token.authorization } })).data || {};

    results.set = async (characteristic: string, data: { [key: string]: any }): Promise<void> => {
        (await Request.put(`${Config.host.get()}/accessory/${bridge}/${id}/${characteristic}`, { value: data }, { headers: { authorization: Config.token.authorization } }));
    };

    if (results.type === "camera") {
        results.snapshot = async (): Promise<string> => {
            const { image } = (await Request.get(`${Config.host.get()}/accessory/${bridge}/${id}/snapshot`, { headers: { authorization: Config.token.authorization } })).data;

            if (!image) return BLANK_IMAGE.join("");

            return image;
        };
    }

    return results;
}
