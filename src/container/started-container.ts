import { AbstractStartedContainer, StartedTestContainer } from 'testcontainers';
import { HttpHeader, HttpMethod, MediaType } from '../util';

const { CONTENT_TYPE } = HttpHeader;
const { APPLICATION_JSON } = MediaType;
const { POST } = HttpMethod;

export class StartedKeycloakContainer extends AbstractStartedContainer {
	constructor(startedTestContainer: StartedTestContainer) {
		super(startedTestContainer);
	}
	
	private getBaseUrl(): string {
		return `http://${this.getHost()}:${this.getFirstMappedPort()}`;
	}
	
	public async createRealm(realm: Realm): Promise<this> {
		const { status } = await fetch(`${this.getBaseUrl()}/admin/`, {
			method: POST,
			headers: { [CONTENT_TYPE]: APPLICATION_JSON },
			body: JSON.stringify({ rep: realm })
		});
		this.throwErrorIfRequestFailed({
			status,
			entity: 'realm'
		});
		return this;
	}
	
	public async createClient(realm: string, client: Client): Promise<this> {
		const { status } = await fetch(`/${realm}/clients`, {
			method: POST,
			headers: { [CONTENT_TYPE]: APPLICATION_JSON },
			body: JSON.stringify({ rep: client })
		});
		this.throwErrorIfRequestFailed({
			status,
			entity: 'Client'
		});
		return this;
	}
	
	public async createUser(realm: string, user: User): Promise<this> {
		const { status } = await fetch(`/${realm}/users`, {
			method: POST,
			headers: { [CONTENT_TYPE]: APPLICATION_JSON },
			body: JSON.stringify({ rep: user })
		});
		this.throwErrorIfRequestFailed({
			status,
			entity: 'User'
		});
		return this;
	}
	
	public async createIdentityProvider(realm: string, identityProvider: IdentityProvider): Promise<this> {
		const { status } = await fetch(`/${realm}/identity-provider/instances`, {
			method: POST,
			headers: { [CONTENT_TYPE]: APPLICATION_JSON },
			body: JSON.stringify({ representation: identityProvider })
		});
		this.throwErrorIfRequestFailed({
			status,
			entity: 'identity provider'
		});
		return this;
	}
	
	private throwErrorIfRequestFailed({ status, entity }: KeycloakApiResponse) {
		if (status) {
			throw Error(`Failed to create ${entity}`);
		}
	}
}

interface KeycloakApiResponse {
	status: number;
	entity: string;
}

interface Realm {
	id?: string;
	realm?: string;
	enabled?: boolean;
}

interface Client {
	id?: string;
	clientId?: string;
	name?: string;
	description?: string;
	enabled?: true;
	publicClient?: boolean;
	redirectUris?: string[];
	registrationAccessToken?: string;
	defaultClientScopes?: string[];
	optionalClientScopes?: string[];
	consentRequired?: boolean;
	bearerOnly?: boolean;
	rootUrl?: string;
	secret?: string;
	authorizationServicesEnabled?: boolean;
	directAccessGrantsEnabled?: boolean;
	implicitFlowEnabled?: boolean;
	serviceAccountsEnabled?: boolean;
	standardFlowEnabled?: boolean;
	webOrigins?: string[];
}

interface User {
	id?: string;
	email?: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	emailVerified?: boolean;
	enabled?: boolean;
	createdTimestamp?: number;
	attributes?: Map<string, string>;
	requiredActions?: string[];
}

interface IdentityProvider {
	internalId?: string;
	alias?: string;
	displayName?: string;
	enabled?: boolean;
	linkOnly?: boolean;
	providerId?: string;
	storeToken?: boolean;
	trustEmail?: boolean;
}