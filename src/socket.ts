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

import io from "socket.io-client";

const SOCKET_URL = process.env.VUE_APP_SOCKET || "/";

class Socket {
    declare private io: any;

    declare private url: string;

    declare private events: { [key: string]: ((args: any) => any) };

    constructor() {
        this.events = {};
    }

    connect(host?: string, port?:number) {
        const keys = Object.keys(this.events);

        this.io = io(host ? `http://${host}:${port && port >= 1 && port <= 65535 ? port : 80}` : SOCKET_URL);

        for (let i = 0; i < keys.length; i += 1) {
            this.io.on(keys[i], this.events[keys[i]]);
        }
    }

    on(event: string, callback: (args: any) => any) {
        this.off(event);
        this.events[event] = callback;

        if (this.io) this.io.on(event, this.events[event]);
    }

    off(event: string) {
        if (this.io) this.io.off(event, this.events[event]);

        delete this.events[event];
    }

    emit(event: string, ...args: any) {
        if (this.io) this.io.emit(event, args);
    }

    install(vue: any): void {
        vue.mixin({ data: () => ({ io: this }) });
    }
}

export default function socket(): Socket {
    return new Socket();
}
