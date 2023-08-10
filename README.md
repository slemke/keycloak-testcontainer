# node-keycloak-testcontainer

This package adds the ability to start keycloak as a testcontainer in node.js.

## Install

```
npm install node-keycloak-testcontainer --save-dev
```

## Example

You can start a keycloak container with a few lines of code:

```js
describe('Keycloak Testcontainer', () => {

    let keycloakContainer;

    beforeAll(async () => {
        keycloakContainer = await new KeycloakContainer()
            .withExposedPorts(8080)
            .start();
    });

    afterAll(async () => {
        await keycloakContainer.stop();
    });

    it('should run against keycloak', () => {
        // ...
    });
});
```

## Features

Currently, this package provides the following features:

### Starting a container

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
```

To use a specific version you can add the version of choice as a constructor argument:

```js
const container = await new KeycloakContainer('19.0.2')
    .start();
```

By default, every testcontainer is always a keycloak in development mode.

### Starting a container with Keycloak commands

You can run this testcontainer with a bunch of different commands to obtain different keycloak functionality.

### With metrics

```js
const container = await new KeycloakContainer()
    .withMetrics()
    .start();
```

### With features

```js
const container = await new KeycloakContainer()
    .withFeatures([
        'docker',
        'token-exchange'
    ])
    .start();
```

### With disabled features

```js
const container = await new KeycloakContainer()
    .withDisabledFeatures([
        'impersonation',
    ])
    .start();
```

### With custom admin user

```js
const container = await new KeycloakContainer()
    .withAdminUser({
        username: 'admin',
        password: 'password'
    })
    .start();
```

### With database

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

```js
const container = await new KeycloakContainer()
    .withRealmImport('/path/to/realm/data')
    .start();
```

### With health

```js
const container = await new KeycloakContainer()
    .withHealth()
    .start();
```

### With exposed ports

Just like any testcontainer you can defined the exposed ports to the host. 
By default this package exposes keycloaks default ports of 8080 and 8443.
If you like to enable additional ports you can also do the following:

```js
const container = await new KeycloakContainer()
    .withExposedPorts(9000);
    .start();
```

### Stopping a container

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
await container.stop();
```

### Restarting a container

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .start();
await container.restart();
```

### Detailed Example

This example contains multiple different options when starting a Keycloak testcontainer:

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .withAdminUser({
        username: 'custom',
        password: 'test'
    })
    .withFeatures([
        'recovery-codes',
        'token-exchange'
    ])
    .withDisabledFeatures([
        'impersonation'
    ])
    .withMetrics()
    .start();
```
