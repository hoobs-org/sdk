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

export interface InputTheme {
    background: string;
    accent: string;
}

export interface TextTheme {
    default: string;
    highlight?: string;
    active?: string;
    input?: string;
    error?: string;
}

export interface ApplicationTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    accent: string;
    dark: string;
    drawer: string;
    input: InputTheme;
    border: string;
}

export interface ButtonTheme {
    background: string;
    text: string;
    border: string;
    primary?: ButtonTheme;
    light?: ButtonTheme;
}

export interface ModalTheme {
    text: TextTheme;
    background: string;
    dark: string;
    form: string;
    mask: string;
    highlight: string;
    input: string;
    accent: string;
    border: string;
}

export interface WidgetTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface MenuTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface NavigationTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface AccessoryTheme {
    text: string;
    background: string;
    highlight: string;
    input: string;
    border: string;
}

export interface ElevationTheme {
    default: string;
    button: string;
}

export interface Theme {
    name: string;
    display: string;
    auto?: boolean;
    mode: string;
    transparency: string;
    application: ApplicationTheme;
    button: ButtonTheme;
    modal: ModalTheme;
    widget: WidgetTheme;
    menu: MenuTheme;
    navigation: NavigationTheme;
    accessory: AccessoryTheme;
    splash: string;
    elevation: ElevationTheme;
}

export const Themes = {
    async get(name: string): Promise<Theme> {
        const results = <any>(await Request.get(`${Config.host.get()}/theme/${name}`, { headers: { authorization: Config.token.authorization } })).data;

        return results;
    },

    async save(name: string, theme: Theme) {
        (await Request.post(`${Config.host.get()}/theme/${name}`, theme, { headers: { authorization: Config.token.authorization } }));
    },

    async backdrop(image: Blob): Promise<string> {
        const form = new FormData();

        form.append("file", image);

        const results = (<{ [key: string]: any }>(await Request.post(`${Config.host.get()}/themes/backdrop`, form, { headers: { authorization: Config.token.authorization } })).data).filename;

        return results;
    },
};
