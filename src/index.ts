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

import Auth from "./auth";
import User from "./user";
import Config from "./config";
import Status from "./status";
import Backup from "./backup";
import Restore from "./restore";
import System from "./system";
import Hostname from "./hostname";
import Extentions from "./extentions";
import Plugin from "./plugin";
import Plugins from "./plugins";
import Repository from "./repository";
import Bridge from "./bridge";
import Accessories from "./accessories";
import Accessory from "./accessory";
import Location from "./location";
import Weather from "./weather";
import Remote from "./remote";
import Socket from "./socket";
import Dates from "./dates";
import Room from "./room";

import { Themes } from "./theme";
import { Bridges } from "./bridges";
import { Rooms } from "./rooms";
import { Log } from "./log";
import { Users } from "./users";
import { Version, Latest } from "./version";

const sdk = {
    version: Version,
    dates: Dates,
    latest: Latest,
    auth: Auth,
    users: Users,
    user: User,
    config: Config,
    log: Log,
    status: Status,
    backup: Backup,
    restore: Restore,
    system: System,
    hostname: Hostname,
    extentions: Extentions,
    plugin: Plugin,
    plugins: Plugins,
    bridges: Bridges,
    bridge: Bridge,
    accessories: Accessories,
    accessory: Accessory,
    rooms: Rooms,
    room: Room,
    theme: Themes,
    location: Location,
    repository: Repository,
    weather: Weather,
    remote: Remote,
    io: Socket,
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
