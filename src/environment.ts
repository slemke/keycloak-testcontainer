export interface AdminUser {
	username: string;
	password: string;
}

export class EnvironmentBuilder {

	private adminUser: AdminUser = {
		username: 'admin',
		password: 'admin'
	};

	public withAdminUser(adminUser: AdminUser) {
		this.adminUser = adminUser;
	}

	public build(): { [key: string]: string } {
		const { username, password } = this.adminUser;
		return {
			KEYCLOAK_ADMIN: username,
			KEYCLOAK_ADMIN_PASSWORD: password
		};
	}
}