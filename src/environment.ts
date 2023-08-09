export class EnvironmentBuilder {
	
	private adminUsername: string = 'admin';

	private adminPassword: string = 'admin';
	
	public withAdminUser(username: string, password: string) {
		this.adminUsername = username;
		this.adminPassword = password;
	}

	public build(): { [key: string]: string } {
		return {
			KEYCLOAK_ADMIN: this.adminUsername,
			KEYCLOAK_ADMIN_PASSWORD: this.adminPassword
		};
	}
}