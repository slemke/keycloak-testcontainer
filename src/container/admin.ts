import KcAdminClient from '@keycloak/keycloak-admin-client';
import { AdminUser } from 'configuration/environment.js';

export interface AdminClientOptions {
	baseUrl: string
	realmName?: string
	totp?: string
}

export default async function({ baseUrl, realmName = 'master', totp }: AdminClientOptions, user: AdminUser) {
    const client = new KcAdminClient({
        baseUrl,
        realmName,
        ...totp && { totp: totp }
    });
    await client.auth({
        username: user.username,
        password: user.password,
        grantType: 'password',
        clientId: 'admin-cli'
    });
    return client;
};
