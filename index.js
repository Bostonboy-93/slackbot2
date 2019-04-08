const Slackbot = require('slackbots');
const axios = require('axios');

const bot = new Slackbot({
    token: 'xoxb-580618039601-590779891974-KvZA4oNw9KOBYcQ95XkSXZNU',
    name: 'portbot'
});

// Start Handler
bot.on('start', () => {
   const params = {
    icon_emoji: ':smiling:'
   };

   bot.postMessageToChannel(
       'portbot',
       'Check flowroute with @portbot!',
       params
   );
});

// Error Handler
bot.on('error', (err) => console.log(err));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message' || data.subtype === 'bot_message') {
        return; 
    }

    handleMessage(data.text);
});

// Response to Data
function handleMessage(message) {
    if(message.includes('portability')) {
        portcheck();
    }
    else if(message.includes('portable')) {
        portcheck();
    }
    else{
         notvalid();     
    }
};
// Portability Responses
function portcheck() {
    axios.get('http://api.yomomma.info')
    .then(res => {
      const joke = res.data.joke;
      
      const params = {
        icon_emoji: ':tada:'
       };
    
       bot.postMessageToChannel(
           'portbot',
           `Yo Momma: ${joke}`, params);
    });
}

//If not valid message
function notvalid() {
    const noParam = {
        icon_emoji: ':laughing:'
       };
    
       bot.postMessageToChannel(
           'portbot',
           'What would you like me to do?' ,
           noParam,
         );
         

};


