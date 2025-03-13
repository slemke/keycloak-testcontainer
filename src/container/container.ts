import {
	GenericContainer,
	Wait
} from 'testcontainers';
import { DatabaseOptions } from '../configuration/commands.js';
import { AdminUser } from '../configuration/environment.js';
import { Keycloak } from '../keycloak.js';
import { StartedKeycloakContainer } from './started-container.js';
import { Configuration } from './configuration.js';

interface KeycloakContainerOptions {
	registry?: string
	tag?: string
}

export class KeycloakContainer extends GenericContainer {

	private configuration: Configuration;

	constructor(options?: KeycloakContainerOptions) {
		const registry = options?.registry ?? 'quay.io/keycloak/keycloak';
		const tag = options?.tag ?? 'latest';
		const imageName = `${registry}:${tag}`;
		super(imageName);
		this.configuration = new Configuration();
	}

	public getImageName() {
		return this.imageName;
	}

	public withHostname(hostname: string): this {
		this.configuration.withHostName(hostname);
		return this;
	}

	public withHealth(): this {
		this.configuration.withHealth();
		return this;
	}

	public withRealmImport(source: string): this {
		this.withCopyDirectoriesToContainer([{
			source,
			target: Keycloak.IMPORT_PATH
		}]);
		this.configuration.withRealmImport();
		return this;
	}

	public withProviders(source: string): this {
		this.withCopyDirectoriesToContainer([{
			source,
			target: Keycloak.PROVIDERS_PATH
		}]);
		return this;
	}

	public withDatabase(options: DatabaseOptions): this {
		this.configuration.withDatabase(options);
		return this;
	}

	public withMetrics(): this {
		this.configuration.withMetrics();
		return this;
	}

	public withFeatures(features: string[]): this {
		this.configuration.withFeatures(features);
		return this;
	}

	public withDisabledFeatures(disabledFeatures: string[]): this {
		this.configuration.withDisabledFeatures(disabledFeatures);
		return this;
	}

	public withAdminUser(adminUser: AdminUser): this {
		this.configuration.withAdminUser(adminUser);
		return this;
	}

	public withManagementPort(managementPort: number): this {
		this.configuration.withManagementPort(managementPort);
		return this;
	}

	public withManagementPath(managementPath: string): this {
		this.configuration.withManagementPath(managementPath);
		return this;
	}

	public withHostnamePath(hostnamePath: string): this {
		this.configuration.withHostnamePath(hostnamePath);
		return this;
	}

	public override async start(): Promise<StartedKeycloakContainer> {
		const hostNamePath = this.configuration.getHostNamePath();
		const endpoint = hostNamePath === '/'
			? '/realms/master'
			: `${hostNamePath}/realms/master`;

		this.withExposedPorts(...this.configuration.getPorts());
		this.withWaitStrategy(Wait.forHttp(endpoint, this.configuration.getPorts()[0]));
		this.withCommand(this.configuration.getCommands());
		this.withEnvironment(this.configuration.getEnvironmentConfiguration());
		return new StartedKeycloakContainer(await super.start(), this.configuration.getAdminUser());
	}
}
