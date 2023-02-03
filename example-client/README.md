# HOOBS sdk example client
## Build
```bash
yarn install
./node_modules/.bin/tsc
```

## Usage
This client currently supports the following commands:
- setting the communication protocol of a bridge &nbsp; ```update \<bridge-id\> --protocol matter|homekit```
- getting a list of all/one bridge(s) &nbsp; ```get [bridge-id]```
- setting the zigbee2mqtt config of a bridge (pass in a path to a JSON file) &nbsp; ```update \<bridge-id\> --zigbee-config <path-to-config.json>```
- getting the zigbee2mqtt config of a bridge &nbsp; ```get-zigbee \<bridge-id\>```

For each command you will have to set these arguments or leave them to their defaults: 

```--host``` - address of system where hoobsd is running (default: localhost)

```--port``` - port where hoobsd is running (default: 80)

```--username``` - your username for hoobsd (default: admin)

```--password``` - your password for hoobsd (default: admin)

### Examples
Setting protocol of a bridge:
<pre>
node . update test --protocol <b>matter</b>
</pre>

Getting all bridges:
<pre>
node . get
</pre>

Getting a specific bridge:
<pre>
node . get test
</pre>

Setting zigbee2mqtt config of a bridge:
<pre>
node . update test --zigbee-config ./zigbee-config.json
</pre>

Getting zigbee2mqtt config of a bridge:
<pre>
node . get-zigbee test
</pre>