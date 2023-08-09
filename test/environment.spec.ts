import { EnvironmentBuilder } from '../src/environment';

describe('Environment Builder', () => {

	const defaultEnvironmentConfiguration = {
		KEYCLOAK_ADMIN: 'admin',
		KEYCLOAK_ADMIN_PASSWORD: 'admin'
	};

	it('should build default environment configuration', () => {
		const builder = new EnvironmentBuilder();
		expect(builder.build()).toStrictEqual(defaultEnvironmentConfiguration);
	});

	it('should build configuration with custom admin user', () => {
		const customAdminUser = {
			KEYCLOAK_ADMIN: 'customAdmin',
			KEYCLOAK_ADMIN_PASSWORD: 'customPassword'
		};
		const builder = new EnvironmentBuilder();
		builder.withAdminUser(
			customAdminUser.KEYCLOAK_ADMIN,
			customAdminUser.KEYCLOAK_ADMIN_PASSWORD
		);
		expect(builder.build()).toStrictEqual(customAdminUser);
	});
});
