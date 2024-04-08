# keycloak-testcontainer

This package adds the ability to start keycloak as a testcontainer in node.js.

## Install

```
npm install keycloak-testcontainer --save-dev
```

ES6 import
```js
import KeycloakContainer from 'keycloak-testcontainer';
```

Common js import:
```js
const KeycloakContainer = require('keycloak-testcontainer').default;
```

## Example

You can start a keycloak container with a few lines of code:

```js
import KeycloakContainer from 'keycloak-testcontainer';

describe('Keycloak Testcontainer Example', () => {

    it('should run against keycloak', () => {
        const container = await new KeycloakContainer().start();

        // do something with the container

        await container.stop();
    });
});
```

## Features

Currently, this package provides the following features:

### Starting a container

```js
import KeycloakContainer from 'keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
```

By default, every container is always a Keycloak in development mode.

### Starting a container with Keycloak commands

You can run this testcontainer with a bunch of different commands to obtain different Keycloak functionality. For a deeper explaination and up to date documentation have a look at the [Keycloak guides](https://www.keycloak.org/guides).

### With metrics

To enable Keycloaks metrics endpoint start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withMetrics()
    .start();
```

### With features

Keycloak provides different additional or experimental features. A list of the supported features can be found [here](https://www.keycloak.org/server/features#_supported_features). To enable additional features start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withFeatures([
        'docker',
        'token-exchange'
    ])
    .start();
```

### With disabled features

Keycloak allows to disable certain features. A list of the supported features can be found [here](https://www.keycloak.org/server/features#_supported_features). To disable certain features start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withDisabledFeatures([
        'impersonation',
    ])
    .start();
```

### With custom admin user

To start the Keycloak container with a custom admin user start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withAdminUser({
        username: 'admin',
        password: 'password'
    })
    .start();
```

### With database

Keycloak runs by default with a h2 database. To run Keycloak with a different database (for example postgres) you can start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withDatabase({
        vendor: 'postgres',
        url: 'your-jdbc-url-here',
        username: 'dbuser',
        password: 'dbpassword'
    });
    .start();
```

### With realm import

To start the Keycloak container with a custom realm you can start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withRealmImport('/path/to/realm/data')
    .start();
```

Ideally, the custom realm import is combined with a custom wait strategy. Keycloak first adds the master realm and the custom realm after it. This testcontainer waits by default for `/realms/master` to be available to recognize a healthy container. Waiting for a custom realm could look like this:

```js
const container = await new KeycloakContainer()
    .withRealmImport('/path/to/realm/data')
    .withWaitStrategy(Wait.forHttp('/realms/custom-realm-name-here', 8080))
    .start();
```

### With health

To enable Keycloaks health endpoint start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withHealth()
    .start();
```

### With custom hostname

To run Keycloak with a custom hostname start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withHostname('localhost')
    .start();
```

### With theme caching disabled

To disable theme caching start the container with the following command:

```js
const container = await new KeycloakContainer()
    .withThemeCacheDisabled()
    .start();
```

### Stopping a container

```js
import KeycloakContainer from 'keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
await container.stop();
```

### Restarting a container

```js
import KeycloakContainer from 'keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
await container.restart();
```

### Admin Client

It is possible to obtain an [admin client](https://www.npmjs.com/package/@keycloak/keycloak-admin-client) for the test container after starting the container. This admin client can be used to change configuration for different tests. You can obtain an admin client with the following command:

```js
const container = await new KeycloakContainer()
    .start();

container.getAdminClient({
    baseUrl: 'http://localhost:8080',
    realmName: 'master',
    totp: '123456'
});
```

The admin client can be customized by using an options object. By default the admin client uses `http://localhost:8080` as the base url and the default admin credentials. If you changed the admin credentials by using `withAdminUser(username, password)` the new credentials will be used by the admin client and don't need to be passed as an option.

Currently, the client accepts the following options (all of them are optional):

* `baseUrl`: The url pointing to keycloak
* `realmName`: The name of the realm (default: `master`)
* `totp`: optional one-time password (if required)