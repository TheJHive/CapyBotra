const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('capybara')
		.setDescription('Gets a capybara instantly'),
	async execute(interaction) {
		await fetch('https://api.capy.lol/v1/capybara?json=true')
            .then(res => res.json())
            .then(json => interaction.reply(json.data.url));
		console.log(`${interaction.user.username}#${interaction.user.discriminator} summoned a capybara!`);
	},
};