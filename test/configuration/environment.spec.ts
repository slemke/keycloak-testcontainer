import { describe, expect, it } from 'vitest';
import { EnvironmentBuilder } from '../../src/configuration/environment';

describe('Environment Builder', () => {

	const defaultEnvironmentConfiguration = {
		KEYCLOAK_ADMIN: 'admin',
		KEYCLOAK_ADMIN_PASSWORD: 'admin',
		KC_HTTP_MANAGEMENT_PORT: '9000'
	};

	it('should build default environment configuration', () => {
		const builder = new EnvironmentBuilder();
		expect(builder.build()).toStrictEqual(defaultEnvironmentConfiguration);
	});

	it('should build configuration with custom hostname', () => {
		const hostname = 'localhost';
		const builder = new EnvironmentBuilder();
		builder.withHostname(hostname);
		expect(builder.build()).toStrictEqual({
			...defaultEnvironmentConfiguration,
			KC_HOSTNAME: hostname
		});
	});

	it('should build configuration with custom admin user', () => {
		const builder = new EnvironmentBuilder();
		builder.withAdminUser({
			username: 'customAdmin',
			password: 'customPassword'
		});
		expect(builder.build()).toStrictEqual({
			...defaultEnvironmentConfiguration,
			KEYCLOAK_ADMIN: 'customAdmin',
			KEYCLOAK_ADMIN_PASSWORD: 'customPassword'
		});
	});
});
