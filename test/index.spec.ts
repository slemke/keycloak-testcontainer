import { KeycloakContainer } from '../src';

describe('Import', () => {
    it('should be able to import and start keycloak container', async () => {
        const container = new KeycloakContainer();
        const startedContainer = await container.start();
        await startedContainer.stop();
    });
});