var Discord = require('discord.io');
var auth = require('./auth.json');
var ytdl = require('ytdl-core');

//make sure you have auth.json in the directory
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    console.log("Bot is online \n");
    listVoiceChannels();
});

function listVoiceChannels(){
    var channels = bot.channels;
    for (var channel in channels){
        if(channels[channel].type == 2){
            console.log(channel + ' : ' + channels[channel].name);
        }
    }
}
bot.on('message', function (user, userID, channelID, message, evt) {
    var voiceChannelID = '441099426375925784'
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        switch (cmd) {
            // !ping
            case 'Hi':
                bot.sendMessage({
                    to: channelID,
                    message: "Hi everyone, I'm Hall!",
                });
                console.log(channelID + " " + user);
                break;
            case 'Say':
                bot.sendMessage({
                    to: channelID,
                    message: message.substring(4,message.length),
                    tts: true
                });
                break;
            case 'Play':
                var url = message.substring(6,message.length);
                console.log(url);
               bot.joinVoiceChannel(voiceChannelID, function(error, event){
                    if(error) return console.error(error);
                    bot.getAudioContext( voiceChannelID, function(error, stream){
                        if(error) return console.error(error);
                        video = ytdl(url, { filter: 'audioonly'});
                        //get a stream, shove it into the stream.
                        video.pipe(stream, {end: false});
                        //after it's done, leave the channel
                        stream.on('done', function(){
                            bot.leaveVoiceChannel(voiceChannelID,function(evt){});
                        });
                        //console.log("Stream Stopped");
                    });
                });
                break;
        }
    }
});
