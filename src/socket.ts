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

let SOCKET_URL = "/";

if (typeof process !== "undefined") SOCKET_URL = process.env.VUE_APP_SOCKET || "/";

interface EventRecord {
    event: string;
    listner: (args: any) => any;
}

class Socket {
    declare private io: any;

    declare private url: string;

    declare private events: EventRecord[];

    constructor() {
        this.events = [];
    }

    connect(host?: string, port?:number) {
        if (this.io) this.io.close();

        this.io = io(host ? `http://${host}:${port && port >= 1 && port <= 65535 ? port : 80}` : SOCKET_URL);
        this.io.removeAllListeners();

        for (let i = 0; i < this.events.length; i += 1) {
            this.io.on(this.events[i].event, this.events[i].listner);
        }
    }

    on(event: string, listner: (args: any) => any) {
        const index = this.events.length;

        this.events.push({
            event,
            listner,
        });

        if (this.io) this.io.on(this.events[index].event, this.events[index].listner);
    }

    off(event: string) {
        let index = this.events.findIndex((item) => item.event === event);

        while (index >= 0) {
            if (this.io) this.io.off(this.events[index].event, this.events[index].listner);

            this.events.splice(index, 1);
            index = this.events.findIndex((item) => item.event === event);
        }
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
