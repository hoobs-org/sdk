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

import Chunk from "./chunk";
import Sanitize from "./sanitize";
import Auth from "./auth";
import User from "./user";
import Config from "./config";
import Status from "./status";
import Backup from "./backup";
import Restore from "./restore";
import System from "./system";
import Extentions from "./extentions";
import Plugins from "./plugins";
import Instance from "./instance";
import Accessories from "./accessories";
import Accessory from "./accessory";
import Location from "./location";
import Weather from "./weather";
import Remote from "./remote";

import { Themes, Theme } from "./theme";
import { Instances, InstanceRecord } from "./instances";
import { Log, LogLevel, Message } from "./log";
import { Users, UserRecord } from "./users";
import { Version, Latest } from "./version";
import { Wait, Sleep } from "./wait";

export { LogLevel };
export { Message };
export { InstanceRecord };
export { UserRecord };
export { Theme };
export { Sanitize };
export { Chunk };
export { Sleep };
export { Wait };

export default function SDK() {
    return {
        version: Version,
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
        extentions: Extentions,
        plugins: Plugins,
        instances: Instances,
        instance: Instance,
        accessories: Accessories,
        accessory: Accessory,
        theme: Themes,
        location: Location,
        weather: Weather,
        remote: Remote,

        mixin() {
            return { computed: { $hoobs: () => this } };
        },
    };
}
