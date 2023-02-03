import hoobs from "@hoobs/sdk-transpiled";
import Bridge from "@hoobs/sdk-transpiled/lib/bridge";

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { readFileSync } from "fs";
import { ZigbeeToMQTTConfig } from "../lib/bridge";

let token: string = ""
hoobs.sdk.config.token.get(() => { return token })
hoobs.sdk.config.token.set((aToken: string) => { token = aToken })

const loginMiddleware = async (argv) => {
    hoobs.sdk.config.host.set(argv.host, argv.port);
    await hoobs.sdk.auth.login(argv.username, argv.password, true).then((loggedIn) => {
        if (!loggedIn) {
            throw new Error("Login failed check the following arguments: host, port, username, password");
        }
        return {}
    })
    .catch(error => console.error(error)) 
}

const updateBridge = (bridgeId: string, protocol: string) => {
    hoobs.sdk.bridges.list()
        .then(bridges => {
            bridges.forEach((bridge) => {
                if (bridge.id === bridgeId) {
                    Bridge(bridge.id).then((bridgeRecord) => {
                        const aBridge = bridgeRecord as any;
                        if (aBridge.update === undefined) {
                            return;
                        }

                        aBridge.update(
                            aBridge.display,
                            aBridge.autostart,
                            aBridge.pin,
                            aBridge.username,
                            aBridge.advertiser,
                            protocol,
                            aBridge.debugging
                        )
                        .then(console.log("update successful"))
                        .catch(error => console.log("update failed", error))
                    })
                }
            })
        })
        .catch(error => console.error(error)) 
} 

const getBridge = (bridgeId?: string) => {
    if (bridgeId) {
        hoobs.sdk.bridge(bridgeId)
            .then(status => console.log(status))
            .catch(error => console.error(error)) 
    } else {
        hoobs.sdk.bridges.list()
            .then((bridges) => {
                console.log(bridges)
            })
            .catch(error => console.error(error)) 
    }
} 

const updateBridgeZigbeeConfig = (bridgeId: string, zigbeeConfig: { [key: string]: any }) => {
    hoobs.sdk.bridge(bridgeId)
        .then(bridge => {
            bridge?.config?.updateZigbee(zigbeeConfig as ZigbeeToMQTTConfig)
                .then(() => console.log("zigbee config update successful"))
                .catch(error => console.log("zigbee config update failed", error));
        })
        .catch(error => console.log("zigbee config update failed", error));
} 

const getBridgeZigbeeConfig = (bridgeId: string) => {
    hoobs.sdk.bridge(bridgeId)
        .then(bridge => {
            bridge?.config?.getZigbee()
                .then(config => console.log(config))
                .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
} 

yargs(hideBin(process.argv))
    .option("host", {
        type: "string",
        demandOption: true,
        default: "localhost"
    })
    .option("port", {
        type: "string",
        demandOption: true,
        default: 80
    })
    .option("username", {
        type: "string",
        demandOption: true,
        default: "admin"
    })
    .option("password", {
        type: "string",
        demandOption: true,
        default: "admin"
    })
    .command("update <id>", "Update bridge with the given id", (yargs) => {
        return yargs
            .positional("id", {
                type: "string",
                demandOption: true,
            })
            .option("protocol", {
                type: "string",
                choices: ["matter", "homekit"]
            })
            .option("zigbee-config", {
                type: "string",
                description: "A Path to JSON file containing the zigbee2mqtt plugin config.",
            })
            .check((argv) => {
                if (!argv["protocol"] && !argv["zigbee-config"]) {
                    throw(new Error("Provide at least one option"))
                }
                return true;
            })
    }, (argv) => {
        if (argv.zigbeeConfig) {
            try {
                const buffer = readFileSync(argv.zigbeeConfig)
                updateBridgeZigbeeConfig(argv.id, JSON.parse(buffer.toString()))
            } catch (_) {
                throw(new Error("Can't read JSON at the given path."))
            }
        }

        if (argv.protocol) updateBridge(argv.id, argv.protocol);
    })
    .command("get [id]", "Get bridges", (yargs) => {
        return yargs
        .positional("id", {
            type: "string"
        })
    }, (argv) => {
        getBridge(argv.id);
    })
    .command("get-zigbee <id>", "Get zigbee config of bridges.", (yargs) => {
        return yargs
        .positional("id", {
            type: "string",
            demandOption: true
        })
    }, (argv) => {
        getBridgeZigbeeConfig(argv.id);
    })
    .demandCommand(1)
    .middleware(loginMiddleware)
    .parse();