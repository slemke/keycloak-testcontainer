import { describe, expect, it } from 'vitest';
import axios from 'axios';
import KeycloakContainer, { StartedKeycloakContainer } from '../../src/index.js';

describe.sequential('Container', () => {

	const managementPort = 9000;

	it('should start new custom keycloak container', async () => {
		const startedContainer = await initCustomKeycloakContainer().start();

		await verifyHealthEndpointAvailability(startedContainer, managementPort);
		await verifyMetricsEndpointAvailability(startedContainer, managementPort);
		await startedContainer.stop({ timeout: 10000 });
	});

	it('should init new keycloak container with latest version', () => {
		const container = new KeycloakContainer();
		expect(container.getImageName()).toMatchObject({
			"image": "keycloak/keycloak",
			"registry": "quay.io",
			"string": "quay.io/keycloak/keycloak:latest",
			"tag": "latest"
		});
	});

	it('should init new custom keycloak container with different tag', () => {
		const container = new KeycloakContainer({ tag: '25' });

		expect(container.getImageName()).toMatchObject({
			"image": "keycloak/keycloak",
			"registry": "quay.io",
			"string": "quay.io/keycloak/keycloak:25",
			"tag": "25"
		});
	});

	it('should init new custom keycloak container based on a different registry', () => {
		const container = new KeycloakContainer({
			registry: 'intern.org/keycloak/keycloak',
			tag: 'custom'
		});
		expect(container.getImageName()).toMatchObject({
			"image": "keycloak/keycloak",
			"registry": "intern.org",
			"string": "intern.org/keycloak/keycloak:custom",
			"tag": "custom"
		});
	})

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

	it('should be able to run with different management port', async () => {
		const nonDefaultManagementPort = 9001;
		const startedContainer = await initCustomKeycloakContainer()
			.withManagementPort(9001)
			.start();

		await verifyMetricsEndpointAvailability(
			startedContainer,
			nonDefaultManagementPort
		);
	});

	it('should be able to run with different management path', async () => {
		const nonDefaultManagementPath = '/admin';
		const startedContainer = await initCustomKeycloakContainer()
			.withManagementPath(nonDefaultManagementPath)
			.start();

		await verifyMetricsEndpointAvailability(
			startedContainer,
			managementPort,
			nonDefaultManagementPath
		);
	});

	it('shoule be able to run with different hostname path', async () => {
		const nonDefaultHostnamePath = '/auth';
		const startedContainer = await initCustomKeycloakContainer()
			.withHostnamePath(nonDefaultHostnamePath)
			.start();

			const response = await axios.get(`http://localhost:${startedContainer.getMappedPort(8080)}/auth`, {
				timeout: 10000
			});
			expect(response.status).toBe(200);
	});

	const initCustomKeycloakContainer = (): KeycloakContainer => {
		return new KeycloakContainer()
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

	const verifyHealthEndpointAvailability = async (container: StartedKeycloakContainer, port: number) => {
		const healthResponse = await axios.get(`http://localhost:${container.getMappedPort(port)}/health`, {
			timeout: 10000
		});
		expect(healthResponse.status).toBe(200);
	};

	const verifyMetricsEndpointAvailability = async (container: StartedKeycloakContainer, port: number, path = '/') => {
		const managementPath = path === '/' ? '/metrics' : `${path}/metrics`;
		const metricsResponse = await axios.get(`http://localhost:${container.getMappedPort(port)}${managementPath}`, {
			timeout: 10000
		});
		expect(metricsResponse.status).toBe(200);
	};
});
