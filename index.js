const Slackbot = require('slackbots');
const axios = require('axios');
require('dotenv').config()
const url = `https://api.flowroute.com/v2/portorders/portability`;
const bot = new Slackbot({
    token: process.env.Slack_Token,
    name: 'portbot'
});

// Start Handler
bot.on('start', () => {
   const params = {
    icon_emoji: ':smiling:'
   };

   bot.postMessageToChannel(
       'portbot',
       'Check flowroute with @portbot by sending a 10 digit number',
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

    const numbers = data.text.split(',');

    portcheck(numbers);
});

function cleanNumberText(numText) {
    return numText.replace(/\D+/, '')
}

function validateNumberText(numText) {
    return numText.length === 10
}

// Portability Responses:
// Takes in an Array of texts, each being a phone number in text form
function portcheck(numberTexts) {
    console.log("START OF PORTCHECK: " + numberTexts)

    cleanedNumberTexts = numberTexts.map(cleanNumberText);
    console.log("CLEANED: " + cleanedNumberTexts)

    const validNumberTexts = [];
    const invalidNumberTexts = [];

    cleanedNumberTexts.forEach(num => {
        if (validateNumberText(num)) {
            validNumberTexts.push(num);
        } else {
            invalidNumberTexts.push(num);
        }
    })

    console.log("VALIDATED: " + validNumberTexts)

    if (validNumberTexts.length == 0) {

        bot.postMessageToChannel(
            'portbot',
            `Umm.... you didn't give me a valid number.  I accept comma separated, 10 digit numbers`);
        return
    }

    const numbers = validNumberTexts
        .map(number => "+1" + number)     
       
    return axios({
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
      const flowrouteResponse = res.data.data;
      
      const params = {
        icon_emoji: ':tada:'
       };
       let response = '';
       if  (flowrouteResponse.portable.length === 0)  {
           response += `There were no portable numbers provided`;
       }
       else {
        response += `These numbers are portable: ${flowrouteResponse.portable}`
       }
       response += `\nThese numbers are not portable: ${flowrouteResponse.nonportable}`

       if (invalidNumberTexts.length !== 0) {
        response += `\n These numbers were not in a valid format: ${invalidNumberTexts}`
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

// portcheck(['12345ABC67890', '3852196797'])