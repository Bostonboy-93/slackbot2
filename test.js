const axios = require('axios')
require('dotenv').config({path: './.env'})

const url = `https://api.flowroute.com/v2/portorders/portability`;

const pattern = /(?<!\d)\d{10}(?!\d)/g

// const numClean = message.replace(/\D/g, ' ');
// console.log(message)

// const message = message.split(' ');


function splitMessage(message) {
    let numberTexts = message.split(' ');

    return numberTexts;
}

function cleanNumberText(numText) {
    return numText.replace(/\D+/, '')
}

function validateNumberText(numText) {
    return numText.length === 10
}

function getPortabilityFromFlowroute(numbers) {
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
}

function process(text) {
    let numbers = splitMessage(text);

    let cleanedNumbers = [];
    numbers.forEach(num => {
        let cleanNum = cleanNumberText(num);
        cleanedNumbers.push(cleanNum)
    });


    // let validNumbers = [];
    // cleanedNumbers.forEach(num => {
    //     console.log('Clean For Loop: ', num)
    //     let isValid = validateNumberText(num)
    //     if (isValid) {
    //         validNumbers.push(num)
    //     }
    // })
    let validNumbers = cleanedNumbers.filter(validateNumberText)

    console.log(validNumbers);

}

process("123 1234-----567890")

// // Portability Responses
function portcheck(validNumbers) {
   
    if (validNumbers.length === 0) {
        // you didn't give me any valid numbers
    }

    const numbers = validNumbers.map(number => "+1" + number) 
    
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

        // The numbers you provided: ...
        // The numbers with incorrect format: +1123
        // Portable Numbers: ...
        // Hypernetwork enabled: ...
        // Unportable: ...
    });
};

// //If not valid message
// function notvalid() {
//     const noParam = {
//         icon_emoji: ':laughing:'
//        };
    
//        bot.postMessageToChannel(
//            'portbot',
//            'What would you like me to do? Give me a 10 digit number to check portability.' ,
//            noParam,
//          );     
// };