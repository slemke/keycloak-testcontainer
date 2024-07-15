import { describe, expect, it } from 'vitest';
import { EnvironmentBuilder } from '../../src/configuration/environment';

describe('Environment Builder', () => {

	const defaultEnvironmentConfiguration = {
		KEYCLOAK_ADMIN: 'admin',
		KEYCLOAK_ADMIN_PASSWORD: 'admin',
		KC_HTTP_MANAGEMENT_PORT: '9000',
		KC_HTTP_MANAGEMENT_RELATIVE_PATH: '/',
		KC_HTTP_RELATIVE_PATH: '/'
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

	it('should build configuration with custom management port', () => {
		const builder = new EnvironmentBuilder();
		builder.withManagementPort(9001);
		expect(builder.build()).toStrictEqual({
			...defaultEnvironmentConfiguration,
			KC_HTTP_MANAGEMENT_PORT: '9001'
		});
	});

	it('should build configuration with custom management path', () => {
		const builder = new EnvironmentBuilder();
		builder.withManagementPath('/admin');
		expect(builder.build()).toStrictEqual({
			...defaultEnvironmentConfiguration,
			KC_HTTP_MANAGEMENT_RELATIVE_PATH: '/admin'
		});
	});
});
