import { KeycloakContainer, StartedKeycloakContainer } from '../src/container';

describe('Container', () => {

	let startedContainer: StartedKeycloakContainer;

	it('should start new keycloak container', async () => {
		startedContainer = await new KeycloakContainer()
			.start();
	});


	it('should stop keycloak container', async () => {
		await startedContainer.stop();
	});
});
