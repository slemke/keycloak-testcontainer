import { CommandsBuilder } from '../src/commands';

describe('Commands Builder', () => {

	const defaultCommands = ['start-dev'];

	it('should build default commands', () => {
		const commandsBuilder = new CommandsBuilder();
		expect(commandsBuilder.build()).toStrictEqual(defaultCommands);
	});

	it('should build commands with features', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withFeatures(['docker', 'token-exchange']);
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--features="docker,token-exchange"'
		]);
	});

	it('should build commands with disabled features', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withDisabledFeatures(['docker', 'token-exchange']);
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--features-disabled="docker,token-exchange"'
		]);
	});

	it('should build commands with metrics enabled', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withMetrics();
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--metrics-enabled=true'
		]);
	});

	it('should build commands with database options', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withDatabase({
			vendor: 'postgres',
			url: 'jdbc-url',
			username: 'dbuser',
			password: 'dbpassword'
		});
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--db=postgres',
			'--db-url=jdbc-url',
			'--db-username=dbuser',
			'--db-password=dbpassword'
		]);
	});

	it('should build commands with import realm option', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withRealmImport();
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--import-realm',
		]);
	});

	it('should build all commands', () => {
		const commandsBuilder = new CommandsBuilder();
		commandsBuilder.withMetrics();
		commandsBuilder.withFeatures(['docker', 'token-exchange']);
		commandsBuilder.withDisabledFeatures(['impersonation']);
		expect(commandsBuilder.build()).toStrictEqual([
			...defaultCommands,
			'--metrics-enabled=true',
			'--features="docker,token-exchange"',
			'--features-disabled="impersonation"'
		]);
	});
});