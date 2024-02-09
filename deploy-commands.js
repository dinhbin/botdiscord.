const fs = require('node:fs');
const path = require('node:path');
const { REST} = require('@discordjs/rest');
const { Routes } = require('discordjs.js');
const { clientId, guildId, token } = require('./config.json');

function getFiles(dir) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });
    let commandFile = [];

    for(const files of files) {
        if(files.isDirectory()){
            commandFile = [
             ...commandFile,
             ...getFiles(`${dir}/${files.name}`)
            ]
        } else if (files.name.endsWith(".js")) {
            commandFile.push(`${dir}/${files.name}`);
        }
    }
    return commandFile;
} 
  
let command = [];
const commandsFiles = getFiles('./commands');

for (const file of commandsFiles) {
    const command = require(file);
    command.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: command })
  .then(() => console.log('Successfully registered application commands!.'))
  .catch(console.error);