import { Keycloak } from '../keycloak.js';

export interface AdminUser {
	username: string;
	password: string;
}

export const defaultAdminUser = {
	username: Keycloak.ADMIN_USER,
	password: Keycloak.ADMIN_PASSWORD
};

export class EnvironmentBuilder {

	private adminUser: AdminUser = defaultAdminUser;

	private hostname: string | undefined;

	public withHostname(hostname: string) {
		this.hostname = hostname;
	}

	public withAdminUser(adminUser: AdminUser) {
		this.adminUser = adminUser;
	}

	public build(): { [key: string]: string } {
		const { username, password } = this.adminUser;
		return {
			KEYCLOAK_ADMIN: username,
			KEYCLOAK_ADMIN_PASSWORD: password,
			...(this.hostname && { KC_HOSTNAME: this.hostname })
		};
	}
}