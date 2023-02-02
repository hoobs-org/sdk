import hoobs from "@hoobs/sdk-transpiled";
import Bridge from "@hoobs/sdk-transpiled/lib/bridge";

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

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

yargs(hideBin(process.argv))
    .option("host", {
        type: "string",
        demandOption: true
    })
    .option("port", {
        type: "string",
        demandOption: true
    })
    .option("username", {
        type: "string",
        demandOption: true
    })
    .option("password", {
        type: "string",
        demandOption: true
    })
    .command("update <id>", "Update bridge with the given id", (yargs) => {
        return yargs
        .positional("id", {
            type: "string",
            demandOption: true,
        })
        .option("protocol", {
            type: "string",
            demandOption: true,
            choices: ["matter", "homekit"]
        });
    }, (argv) => {
        updateBridge(argv.id, argv.protocol);
    })
    .command("get [id]", "Get bridges", (yargs) => {
        return yargs
        .positional("id", {
            type: "string"
        })
    }, (argv) => {
        getBridge(argv.id);
    })
    .demandCommand(1)
    .middleware(loginMiddleware)
    .parse();