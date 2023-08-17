import { AbstractStartedContainer, StartedTestContainer } from 'testcontainers';

export class StartedKeycloakContainer extends AbstractStartedContainer {
	constructor(startedTestContainer: StartedTestContainer) {
		super(startedTestContainer);
	}
}
