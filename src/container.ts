import { 
	AbstractStartedContainer,
	GenericContainer,
	StartedTestContainer
} from 'testcontainers';
import { CommandsBuilder } from './commands';
import { EnvironmentBuilder } from './environment';

export class KeycloakContainer extends GenericContainer {

	private port: number = 8080;

	private commandsBuilder: CommandsBuilder;

	private environmentBuilder: EnvironmentBuilder;

	constructor(version: string = 'latest') {
		super(`quay.io/keycloak/keycloak:${version}`);
		this.commandsBuilder = new CommandsBuilder();
		this.environmentBuilder = new EnvironmentBuilder();
	}

	public withMetrics(): this {
		this.commandsBuilder.withMetrics();
		return this;
	}

	public withFeatures(features: string[]): this {
		this.commandsBuilder.withFeatures(features);
		return this;
	}

	public withDisabledFeatures(disabledFeatures: string[]): this { 
		this.commandsBuilder.withDisabledFeatures(disabledFeatures);
		return this;
	}

	public withAdminUser(username: string, password: string): this {
		this.environmentBuilder.withAdminUser(username, password);
		return this;
	}

  public override async start(): Promise<StartedKeycloakContainer> {
		this.withExposedPorts(this.port);
		this.withCommand(this.commandsBuilder.build());
		this.withEnvironment(this.environmentBuilder.build());
		return new StartedKeycloakContainer(await super.start());
  }
}

export class StartedKeycloakContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
		super(startedTestContainer);
  }
}
