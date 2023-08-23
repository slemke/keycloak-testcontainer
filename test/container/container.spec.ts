import { Wait } from 'testcontainers';
import { 
	KeycloakContainer,
	StartedKeycloakContainer
} from '../../src';

describe('Container', () => {

	let startedContainer: StartedKeycloakContainer;

	it('should start new keycloak container', async () => {
		startedContainer = await new KeycloakContainer()
			.withWaitStrategy(Wait.forHttp('/realms/master', 8080))
			.start();
	});


	it('should stop keycloak container', async () => {
		await startedContainer.stop();
	});
});
