import {
	GenericContainer,
	Wait
} from 'testcontainers';
import { CommandsBuilder, DatabaseOptions } from '../configuration/commands.js';
import { AdminUser, EnvironmentBuilder, defaultAdminUser } from '../configuration/environment.js';
import { Keycloak } from '../keycloak.js';
import { StartedKeycloakContainer } from './started-container.js';

export class KeycloakContainer extends GenericContainer {

	private defaultPort = 8080;

	private ports: number[] = [this.defaultPort];

	private commandsBuilder: CommandsBuilder;

	private environmentBuilder: EnvironmentBuilder;

	private adminUser: AdminUser = defaultAdminUser;

	constructor() {
		super('quay.io/keycloak/keycloak:latest');
		this.commandsBuilder = new CommandsBuilder();
		this.environmentBuilder = new EnvironmentBuilder();
	}

	public withHostname(hostname: string): this {
		this.environmentBuilder.withHostname(hostname);
		return this;
	}

	public withHealth(): this {
		this.commandsBuilder.withHealth();
		return this;
	}

	public withRealmImport(source: string): this {
		this.withCopyDirectoriesToContainer([{
			source,
			target: Keycloak.IMPORT_PATH
		}]);
		return this;
	}

	public withDatabase(options: DatabaseOptions): this {
		this.commandsBuilder.withDatabase(options);
		return this;
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

	public withAdminUser(adminUser: AdminUser): this {
		this.adminUser = adminUser;
		this.environmentBuilder.withAdminUser(adminUser);
		return this;
	}

	public override async start(): Promise<StartedKeycloakContainer> {
		this.withExposedPorts(...this.ports);
		this.withWaitStrategy(Wait.forLogMessage(/(.*)Running the server in development mode(.*)/));
		this.withCommand(this.commandsBuilder.build());
		this.withEnvironment(this.environmentBuilder.build());
		return new StartedKeycloakContainer(await super.start(), this.adminUser);
	}
}
