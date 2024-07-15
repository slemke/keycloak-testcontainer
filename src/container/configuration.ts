import {
	CommandsBuilder,
	DatabaseOptions
} from '../configuration/commands.js';
import {
	AdminUser,
	EnvironmentBuilder,
	defaultAdminUser
} from '../configuration/environment.js';

export class Configuration {
	private defaultPort = 8080;

	private commandsBuilder: CommandsBuilder;

	private environmentBuilder: EnvironmentBuilder;

	private adminUser: AdminUser = defaultAdminUser;

	constructor() {
		this.commandsBuilder = new CommandsBuilder();
		this.environmentBuilder = new EnvironmentBuilder();
	}

	public withHostName(hostname: string): this {
		this.environmentBuilder.withHostname(hostname);
		return this;
	}

	public withHealth(): this {
		this.commandsBuilder.withHealth();
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

	public withManagementPort(managementPort: number): this {
		this.environmentBuilder.withManagementPort(managementPort);
		return this;
	}

	public withManagementPath(managementPath: string): this {
		this.environmentBuilder.withManagementPath(managementPath);
		return this;
	}

	public withHostnamePath(path: string): this {
		this.environmentBuilder.withHostnamePath(path);
		return this;
	}

	public getCommands(): string[] {
		return this.commandsBuilder.build();
	}

	public getEnvironmentConfiguration(): {[ key: string]: string } {
		return this.environmentBuilder.build();
	}

	public getAdminUser(): AdminUser {
		return this.adminUser;
	}

	public getPorts(): number[] {
		return [
			this.defaultPort,
			this.environmentBuilder.getManagementPort()
		];
	}
}
