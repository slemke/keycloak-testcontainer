import { describe, expect, it, afterEach } from 'vitest';
import axios from 'axios';
import { Wait } from 'testcontainers';
import KeycloakContainer, { StartedKeycloakContainer } from '../../src/index.js';

describe('Container', () => {

	let startedContainer: StartedKeycloakContainer;

	afterEach(async () => {
		await startedContainer.stop();
	});

	it('should start new custom keycloak container', async () => {
		startedContainer = await initCustomKeycloakContainer().start();
		await verifyHealthEndpointAvailability(startedContainer);
		await verifyMetricsEndpointAvailability(startedContainer);
	});

	it('should be able to use admin client', async () => {
		startedContainer = await initCustomKeycloakContainer().start();
		const client = await startedContainer.getAdminClient();
		expect(client.realmName).toBe('master');
	});

	it('should be able to use admin client with different admin user', async () => {
		startedContainer = await initCustomKeycloakContainer().withAdminUser({
			username: 'test',
			password: 'test'
		}).start();
		
		const client = await startedContainer.getAdminClient();
		expect(client.realmName).toBe('master');
	});

	const initCustomKeycloakContainer = (): KeycloakContainer => {
		return new KeycloakContainer()
			.withWaitStrategy(Wait.forHttp('/realms/master', 8080))
			.withHostname('keycloak')
			.withHealth()
			.withFeatures([
				'recovery-codes',
				'token-exchange'
			])
			.withDisabledFeatures([
				'impersonation'
			])
			.withAdminUser({
				username: 'test',
				password: '123'
			})
			.withMetrics();
	};

	const verifyHealthEndpointAvailability = async (container: StartedKeycloakContainer) => {
		const healthResponse = await axios.get(`http://localhost:${container.getFirstMappedPort()}/health`);
		expect(healthResponse.status).toBe(200);
	};

	const verifyMetricsEndpointAvailability = async (container: StartedKeycloakContainer) => {
		const metricsResponse = await axios.get(`http://localhost:${container.getFirstMappedPort()}/metrics`);
		expect(metricsResponse.status).toBe(200);
	};
});
