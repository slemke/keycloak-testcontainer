import { KeycloakContainer } from '../src/container/container';
import { StartedKeycloakContainer } from '../src/container/started-container';

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
