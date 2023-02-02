# HOOBS sdk example client
## Build
```bash
yarn install
./node_modules/.bin/tsc
```

## Usage
This client currently supports setting the communication protocol of a bridge(update \<bridge-id\> --protocol matter|homekit) and getting a list of all/one bridge(s) (get [bridge-id]).
Before each command you will have to set these arguments: 

```--host``` - system where hoobsd is running

```--port``` - port where hoobsd is running

```--username``` - your username for hoobsd

```--password``` - your password for hoobsd

### Examples
Setting protocol of a bridge:
<pre>
node . --host localhost --port 80 --username admin --password admin update test --protocol <b>matter</b>
</pre>

Getting all bridges:
<pre>
node . --host localhost --port 80 --username admin --password admin get
</pre>

Getting a specific bridge:
<pre>
node . --host localhost --port 80 --username admin --password admin get test
</pre>