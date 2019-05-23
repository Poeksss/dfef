const discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("MANAGE_MESSAGES")) {
        message.channel.fetchMessages()
            .then(function(list){
                message.channel.bulkDelete(list);
            }, function(err){message.channel.send("ERROR: CAN'T CLEAN")});
    }
}

module.exports.help = {
    name: "clearchat"
}