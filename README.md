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
    .withExposedPorts(8080)
    .start();
```

To use a specific version you can add the version of choice as a constructor argument:

```js
const container = await new KeycloakContainer('19.0.2')
    .withExposedPorts(8080)
    .start();
```

By default, every testcontainer is always a keycloak in development mode.

### Starting a container with Keycloak commands

You can run this testcontainer with a bunch of different commands to obtain different keycloak functionality.

### With metrics

```js
const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .withMetrics()
    .start();
```

### With features

```js
const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .withFeatures([
        'docker',
        'token-exchange'
    ])
    .start();
```

### With disabled features

```js
const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .withDisabledFeatures([
        'impersonation',
    ])
    .start();
```

### With custom admin user

```js
const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .withAdminUser('admin', 'password')
    .start();
```

### Stopping a container

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .start();
await container.stop();
```

### Restarting a container

```js
import { KeycloakContainer } from 'node-keycloak-testcontainer';

const container = await new KeycloakContainer()
    .withExposedPorts(8080)
    .start();
await container.restart();
```