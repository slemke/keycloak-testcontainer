export interface DatabaseOptions {
	vendor: string;
	url: string;
	username: string;
	password: string;
}

export class CommandsBuilder {

	private features: string[] = [];

	private disabledFeatures: string[] = [];

	private isMetricsEnabled = false;

	private database: DatabaseOptions | undefined;

	public withDatabase(options: DatabaseOptions): this {
		this.database = options; 
		return this;
	}

	public withMetrics(): this {
		this.isMetricsEnabled = true;
		return this;
	}

	public withFeatures(features: string[]): this {
		this.features = features;
		return this;
	}

	public withDisabledFeatures(disabledFeatures: string[]): this {
		this.disabledFeatures = disabledFeatures;
		return this;
	}

	public build(): string[] {
		const commands = ['start-dev'];
		if (this.isMetricsEnabled) {
			commands.push('--metrics-enabled=true');
		}
		if (this.features.length > 0) {
			commands.push(`--features="${this.features.join(',')}"`);
		}
		if (this.disabledFeatures.length > 0) {
			commands.push(`--features-disabled="${this.disabledFeatures.join(',')}"`);
		}
		if (this.database) {
			commands.push(`--db=${this.database.vendor}`);
			commands.push(`--db-url=${this.database.url}`);
			commands.push(`--db-username=${this.database.username}`);
			commands.push(`--db-password=${this.database.password}`);
		}
		return commands;
	}
}
