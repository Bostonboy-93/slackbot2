const Slackbot = require('slackbots');
const axios = require('axios');
require('dotenv').config()
const url = `https://api.flowroute.com/v2/portorders/portability`;
const bot = new Slackbot({
    token: 'xoxb-580618039601-590779891974-7G5ZFm58X4rVSt1nBCsR65u9',
    name: 'portbot'
});

// Start Handler
bot.on('start', () => {
   const params = {
    icon_emoji: ':smiling:'
   };

//    bot.postMessageToChannel(
//        'portbot',
//        'Check flowroute with @portbot by sending a 10 digit number',
//        params
//    );
});

// Error Handler
bot.on('error', (err) => console.log(err));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message' || data.subtype === 'bot_message') {
        return; 
    }

    portcheck(data.text);
});

const pattern = /(?<!\d)\d{10}(?!\d)/g

// const numClean = message.replace(/\D/g, ' ');
// console.log(message)

// const message = message.split(' ');

// Portability Responses
function portcheck(message) {
    if (pattern.test(message) === false) {
        bot.postMessageToChannel(
            'portbot',
            `Umm.... you didn't give me a 10 digit number`);
        return
    }

    const numbers = message.match(pattern)
        .map(number => "+1" + number) 
    
    axios({
        method: 'post',
        url,
        auth: {
          username: process.env.FLOW_ROUTE_USERNAME,
          password: process.env.FLOW_ROUTE_PASSWORD,
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "numbers": numbers,
        }
    })
    .then(res => {
        console.log(res.data)
      const portable = res.data.data.portable;
      
      const params = {
        icon_emoji: ':tada:'
       };
       let response;
       if  (portable.length === 0)  {
           response = `I'm sorry this is not portable`;
       }
       else {
        response = `These numbers are portable: ${portable}`
       }
       bot.postMessageToChannel(
           'portbot',
           response, params);
    })
    .catch(function (error) {
        console.log(error.response.data);
    });
};

//If not valid message
function notvalid() {
    const noParam = {
        icon_emoji: ':laughing:'
       };
    
       bot.postMessageToChannel(
           'portbot',
           'What would you like me to do? Give me a 10 digit number to check portability.' ,
           noParam,
         );
         

};

//Axios 
// axios({
//     method: 'post',
//     url: 'https://api.flowroute.com/v2/portorders/portability',
//     auth: {
//       username: '95811327',
//       password: 'KVVWeZPf9YkbrPcp15gutZmAM9JD0d0o'
//     }
//   });
