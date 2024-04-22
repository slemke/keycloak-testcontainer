import { describe, expect, it } from 'vitest';
import axios from 'axios';
import KeycloakContainer, { StartedKeycloakContainer } from '../../src/index.js';

describe.sequential('Container', () => {

	it('should start new custom keycloak container', async () => {
		const startedContainer = await initCustomKeycloakContainer().start();

		await verifyHealthEndpointAvailability(startedContainer);
		await verifyMetricsEndpointAvailability(startedContainer);
		await startedContainer.stop({ timeout: 10000 });
	});

	it('should be able to use admin client', async () => {
		const startedContainer = await initCustomKeycloakContainer().start();

		const client = await startedContainer.getAdminClient();
		expect(client.realmName).toBe('master');
		await startedContainer.stop({ timeout: 10000 });
	});

	it('should be able to use admin client with different admin user', async () => {
		const startedContainer = await initCustomKeycloakContainer().withAdminUser({
			username: 'test',
			password: 'test'
		}).start();

		const client = await startedContainer.getAdminClient();
		expect(client.realmName).toBe('master');
		await startedContainer.stop({ timeout: 10000 });
	});

	const initCustomKeycloakContainer = (): KeycloakContainer => {
		return new KeycloakContainer()
			.withHostname('keycloak')
			.withHealth()
			.withFeatures([
				'recovery-codes',
				'token-exchange'
			])
			.withDisabledFeatures([
				'impersonation'
			])
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
