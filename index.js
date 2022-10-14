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