import { KeycloakContainer } from '../src/container/container';
import { StartedKeycloakContainer } from '../src/container/started-container';

describe('Container', () => {

	let startedContainer: StartedKeycloakContainer;

	it('should start new keycloak container', async () => {
		startedContainer = await new KeycloakContainer()
			.start();
	});


	it('should be able to create realm', async() => {
		await startedContainer.createRealm({
			id: 'realm',
			realm: 'realm',
			enabled: true
		});
	});
	
	it('should be able to create client', async () => {
		await startedContainer.createClient('realm', {
			name: 'Test',
			clientId: 'test',
			enabled: true,
			publicClient: false,
			bearerOnly: true,
			consentRequired: true,
			secret: '833f7a35-5513-4533-bc58-8e6b64279514',
			redirectUris: ['http://localhost:8080'],
			optionalClientScopes: ['profile'],
			defaultClientScopes: ['openid', 'email']
		});
	});
	
	it('should be able to create identity provider', async () => {
		await startedContainer.createIdentityProvider('realm', {
			providerId: 'test',
			internalId: 'test',
			alias: 'test',
			displayName: 'Test Identity Provider',
			enabled: true,
			storeToken: false,
			trustEmail: false
		});
	});
	
	it('should be able to create user', async () => {
		await startedContainer.createUser('realm', {
			email: 'test@local-test.com',
			username: 'test@local-test.com',
			firstName: 'FirstTestName',
			lastName: 'LastTestName',
			emailVerified: true,
			enabled: true
		});
	});

	it('should stop keycloak container', async () => {
		await startedContainer.stop();
	});
});
