const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Capybaras Initialized!');
});

client.login(token);


const job = new CronJob(
    '0 * * * *',
    function () {
        fetch('https://api.capy.lol/v1/capybara')
            .then(json => client.channels.cache.get('1025262706040774708').send(json.url));
    }, // I don't know how this works, and I'm not gonna try to pretend I do either.
    null,
    true,
    'America/Los_Angeles'
);