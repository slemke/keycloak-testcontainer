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

	private managementPort: number = 9000;

	public withHostname(hostname: string) {
		this.hostname = hostname;
	}

	public withAdminUser(adminUser: AdminUser) {
		this.adminUser = adminUser;
	}

	public withManagementPort(port: number) {
		this.managementPort = port;
	}

	public getManagementPort(): number {
		return this.managementPort;
	}

	public build(): { [key: string]: string } {
		const { username, password } = this.adminUser;
		return {
			KEYCLOAK_ADMIN: username,
			KEYCLOAK_ADMIN_PASSWORD: password,
			KC_HTTP_MANAGEMENT_PORT: this.managementPort.toString(),
			...(this.hostname && { KC_HOSTNAME: this.hostname })
		};
	}
}
