# ![](https://raw.githubusercontent.com/hoobs-org/HOOBS/master/docs/logo.png)

HOOBS JavaScript SDK for building applications that talk with the HOOBS API.

## Installing
HOOBS recommends Yarn. From your project's root run;

```sh
yarn add @hoobs/sdk
```

Or using NPM.

```sh
npm install @hoobs/sdk
```

## Useage
First you need to import the SDK

```js
import SDK from "@hoobs/sdk";
```

Then create an bridge.
```js
const hoobs = SDK();
```

## Authorization Token
The HOOBS SDK manages authorization tokens for you. To do this you need to define the functions used to get and set the token. This is usefull, because it allows you to intergrate the authorization token into your projects state management.

```js
hoobs.config.token.get(() => {
    // fetch and return the stored token
});

hoobs.config.token.set((token) => {
    // store token logic
});
```

> Without this you will not be able to login to the HOOBS API.

## Intergrating with Vue
The HOOBS SDK is designed to be used with Vue. To setup the mixin, modify your main.ts|js file. This example uses Vuex for managing the authorization token.

```js
import Vue from "vue";
import Vuex from "vuex";
import SDK from "@hoobs/sdk";

import app from "./app.vue";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        session: "",
        user: {
            permissions: {},
        },
    },

    mutations: {
        "SESSION:SET": (state: { [key: string]: any }, token: string) => {
            state.session = token;

            if (token && token !== "") {
                const user = JSON.parse(atob(token));

                state.user = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    permissions: user.permissions || {},
                };
            } else {
                state.user = {
                    permissions: {},
                };
            }
        }
    }
};

const hoobs = SDK();

hoobs.config.token.get(() => store.state.session);
hoobs.config.token.set((token) => { store.commit("SESSION:SET", token); });

Vue.mixin(hoobs.mixin());

new Vue({
    store,
    render: (h) => h(app),
}).$mount("#app");
```

Now you will be able to access the SDK via `this.$hoobs` in your components.

```html
<script>
    export default {
        data() {
            return {
                version: "",
            }
        },

        async mounted() {
            this.version = await this.$hoobs.version();
        }
    }
</script>
```

## Documentation
SDK documentation can be found here.  
[SDK Documentation](https://github.com/hoobs-org/HOOBS/blob/main/docs/SDK.md)  