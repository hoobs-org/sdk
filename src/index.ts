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

import Accessories from "./accessories";
import Accessory from "./accessory";
import Auth from "./auth";
import Backup from "./backup";
import Bridge from "./bridge";
import Config from "./config";
import Dates from "./dates";
import Hostname from "./hostname";
import Location from "./location";
import Network from "./network";
import Networks from "./networks";
import Plugin from "./plugin";
import Plugins from "./plugins";
import Repository from "./repository";
import Restore from "./restore";
import Room from "./room";
import Socket from "./socket";
import Status from "./status";
import System from "./system";
import User from "./user";
import Weather from "./weather";
import Wireless from "./wireless";

import { BlueZ } from "./blue-z";
import { Bridges } from "./bridges";
import { Log } from "./log";
import { Rooms } from "./rooms";
import { Themes } from "./theme";
import { Thread } from "./thread";
import { Users } from "./users";
import { Version, Latest } from "./version";
import { Zigbee } from "./zigbee";

const sdk = {
    accessories: Accessories,
    accessory: Accessory,
    auth: Auth,
    backup: Backup,
    blueZ: BlueZ,
    bridge: Bridge,
    bridges: Bridges,
    config: Config,
    dates: Dates,
    hostname: Hostname,
    io: Socket,
    latest: Latest,
    location: Location,
    log: Log,
    network: Network,
    networks: Networks,
    plugin: Plugin,
    plugins: Plugins,
    repository: Repository,
    restore: Restore,
    room: Room,
    rooms: Rooms,
    status: Status,
    system: System,
    theme: Themes,
    thread: Thread,
    user: User,
    users: Users,
    version: Version,
    weather: Weather,
    wireless: Wireless,
    zigbee: Zigbee,
};

export default {
    sdk,

    install(Vue: any) {
        Vue.mixin({
            computed: {
                $hoobs: () => sdk,
            },
        });
    },
};

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    Object.defineProperty(window, "$hoobs", {
        get: () => sdk,
    });
}
