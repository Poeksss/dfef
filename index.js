const discord = require("discord.js");
const client = new discord.Client();
const fs = require("fs");
const botconfig = require("./botconfig.json")
client.commands = new discord.Collection();

fs.readdir("./commands", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("couldnt find comands");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);

        console.log(`${f} loaded`)
        client.commands.set(props.help.name, props);
    });

});

client.on("ready", () => {
    console.log("ready");
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messsageArray = message.content.split(" ");
    let cmd = messsageArray[0];
    let args = messsageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client,message,args);

    if(cmd === '!report') {

        let target = message.mentions.users.first() || message.guild.members.get(args[0])
        if(!target) return message.channel.send("pleas provide a user").then(m => m.delete(9000))

        let reason = args.slice(1).join(" ");
        if(!reason) return message.channel.send("pleas provide a reason").then(m => m.delete(9000))

        let sChannel = message.guild.channels.find(x => x.name === "reports")

        sChannel.send(`**${message.author.tag}** has reported **${target}** for **${reason}**`).then(async message => {
            await message.react("✅")
            await message.react("❌")
        })
        if(cmd === '!play'){
            message.reply('d');
        }


    }


});

client.on("guildMemberAdd", e => {
    const wchannel = client.channels.get("580033726700978217");
    let role = e.guild.roles.find(r => r.name === "player");

    wchannel.send(`${e.displayName} has joined the PeanutButter army😐🎉🎉`);
    e.addRole(role);
})

client.login(process.env.token);