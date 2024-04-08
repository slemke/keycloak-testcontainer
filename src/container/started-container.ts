import { AbstractStartedContainer, StartedTestContainer } from 'testcontainers';
import initAdminClient, { AdminClientOptions } from './admin.js';
import { AdminUser } from 'configuration/environment.js';

export class StartedKeycloakContainer extends AbstractStartedContainer {

	private adminUser: AdminUser;

	constructor(startedTestContainer: StartedTestContainer, adminUser: AdminUser) {
		super(startedTestContainer);
		this.adminUser = adminUser;
	}

	public async getAdminClient(options?: AdminClientOptions) {
		if (!options) {
			const defaultOptions = { baseUrl: `http://localhost:${this.getFirstMappedPort()}` };
			return await initAdminClient(defaultOptions, this.adminUser);
		}
		return await initAdminClient(options, this.adminUser);
	}
}
