export class CommandsBuilder {

	private features: string[] = [];

	private disabledFeatures: string[] = [];

	private isMetricsEnabled = false;

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
		return commands;
	}
}
