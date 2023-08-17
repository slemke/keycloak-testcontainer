import {
	GenericContainer,
} from 'testcontainers';
import { CommandsBuilder, DatabaseOptions } from '../configuration/commands';
import { AdminUser, EnvironmentBuilder } from '../configuration/environment';
import { Keycloak } from '../keycloak';
import { StartedKeycloakContainer } from './started-container';

export class KeycloakContainer extends GenericContainer {

	private ports: number[] = [8080];

	private commandsBuilder: CommandsBuilder;

	private environmentBuilder: EnvironmentBuilder;

	constructor(version: string = 'latest') {
		super(`quay.io/keycloak/keycloak:${version}`);
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
		this.environmentBuilder.withAdminUser(adminUser);
		return this;
	}

	public override async start(): Promise<StartedKeycloakContainer> {
		this.withExposedPorts(...this.ports);
		this.withCommand(this.commandsBuilder.build());
		this.withEnvironment(this.environmentBuilder.build());
		return new StartedKeycloakContainer(await super.start());
	}
}