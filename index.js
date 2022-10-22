const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Completely copied code (I know what I'm doing definitely)
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once('ready', () => {
	console.log('Capybaras Initialized!');
});

client.login(token);

client.on(Events.InteractionCreate, async interaction => {
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const job = new CronJob(
    '0 * * * *',
    function () {
        fetch('https://api.capy.lol/v1/capybara?json=true')
            .then(res => res.json())
            .then(json => client.channels.cache.get('1025262706040774708').send(json.data.url));
            // I don't know how this works, and I'm not gonna try to pretend I do either.
        console.log(`Capybara deployed at ${new Date().getHours()}:00!`);
    },
    null,
    true,
    'America/Los_Angeles'
);