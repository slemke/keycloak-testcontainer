import { 
	AbstractStartedContainer,
	GenericContainer,
	StartedTestContainer
} from 'testcontainers';

export class KeycloakContainer extends GenericContainer {
	constructor() {
		super('quay.io/keycloak/keycloak:latest');
	}

  public override async start(): Promise<StartedKeycloakContainer> {
    return new StartedKeycloakContainer(await super.start());
  }
}

export class StartedKeycloakContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }
}
