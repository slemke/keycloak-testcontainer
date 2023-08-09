import { KeycloakContainer, StartedKeycloakContainer } from '../src/container';

describe('Container', () => {

	let startedContainer: StartedKeycloakContainer;

	it('should start new keycloak container', async () => {
		startedContainer = await new KeycloakContainer()
			.withExposedPorts(8080)
			.start();
	});


	it('should stop keycloak container', async () => {
		await startedContainer.stop();
	});
});
