import { Wait } from 'testcontainers';
import { KeycloakContainer } from '../src';

describe('Import', () => {
    it('should be able to import and start keycloak container', async () => {
        const container = new KeycloakContainer();
        const startedContainer = await container
            .withWaitStrategy(Wait.forHttp('/realms/master', 8080))
            .start();
        await startedContainer.stop();
    });
});