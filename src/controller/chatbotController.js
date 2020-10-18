require('dotenv').config();
import request from 'request';

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

const test = (req, res) => res.send("hola amigo");

const getWebhook  = (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }}
};



const postWebhook = (req, res) => {

    const body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach(entry => {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      // console.log(webhook_event);

    // Get the sender PSID
    let sender_psid = webhook_event.sender.id;
    console.log('Sender PSID: ' + sender_psid);
 

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        console.log(webhook_event.message.text);
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        console.log(webhook_event.postback);
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

// Handles messages events
// function handleMessage(sender_psid, received_message) {
//   let response;
  
//   // Checks if the message contains text
//   if (received_message.text) {    
//     // Create the payload for a basic text message, which
//     // will be added to the body of our request to the Send API
//     response = {
//       "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
//     }
//   } else if (received_message.attachments) {
//     // Get the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
    // response = {
    //   "attachment": {
    //     "type": "template",
    //     "payload": {
    //       "template_type": "generic",
    //       "elements": [{
    //         "title": "Is this the right picture?",
    //         "subtitle": "Tap a button to answer.",
    //         "image_url": attachment_url,
    //         "buttons": [
    //           {
    //             "type": "postback",
    //             "title": "Yes!",
    //             "payload": "yes",
    //           },
    //           {
    //             "type": "postback",
    //             "title": "No!",
    //             "payload": "no",
    //           }
    //         ],
    //       }]
    //     }
    //   }
    // }
   //} 
  
  // Send the response message
 // callSendAPI(sender_psid, response);    
//}




// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') 
      response = { "text": "Thanks!" }

  else if (payload === 'no')
      response = { "text": "Oops" }

  else if (payload === 'veg') 
      response = { "text": "size?" }

  else if (payload === 'Non-veg')
      response = { "text": "medium?" }
  else
      response = { "text": "okay."}
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": typeof response === 'object' ? response:{"text": response}
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err)
      console.log('message sent!')
  else
      console.error("Unable to send message:" + err);

  }); 
}

//nlp config
const firstTrait = (nlp, name) => nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];

//handling messages 
const handleMessage = (sender_psid, message) => {

  if( message && message.attachments && message.attachments[0].payload){
      callSendAPI(sender_psid, "wow, you're so sweet");
      return;
  }

  let entitiesArr = [ "wit$greetings", "wit$thanks", "wit$bye" ];
  let entityChosen = "";
  entitiesArr.forEach(name => {
      let entity = firstTrait(message.nlp, name);
      if (entity && entity.confidence > 0.8) {
          entityChosen = name;
      }
  });

  if(entityChosen === ""){
      //default
      callSendAPI(sender_psid,`sorry, I don't get you!` );
  }else{
     if(entityChosen === "wit$greetings"){
         //send greetings message
        // callSendAPI(sender_psid,`Hi there!, are you hungry? Let's get you something tasty delivered.`);

          let response = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": "Hi there! are you hungry? Let's get you something tasty delivered from Yo Yo Pizza.",
                "title": "What kind of pizza do you want?",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "veg",
                      "payload": "veg",
                    },
                    {
                      "type": "postback",
                      "title": "Non-veg",
                      "payload": "Non-veg",
                    },
                  ],
              }
            }
          }
                    

            callSendAPI(sender_psid, response);  
     }
     if(entityChosen === "wit$thanks"){
         //send thanks message
         callSendAPI(sender_psid,`You 're welcome!`);
     }
      if(entityChosen === "wit$bye"){
          //send bye message
          callSendAPI(sender_psid,'bye-bye!');
      }
  }
}


module.exports = {
    test,
    getWebhook,
    postWebhook,
}



// let response = {
//   "attachment": {
//     "type": "template",
//     "payload": {
//       "template_type": "button",
//       "text": "Hi there! are you hungry? Let's get you something tasty delivered from Yo Yo Pizza.What kind of pizza do you want?",
      
//         "buttons": [
//           {
//             "type": "postback",
//             "title": "veg",
//             "payload": "veg",
//           },
//           {
//             "type": "postback",
//             "title": "Non-veg",
//             "payload": "Non-veg",
//           },
//         ],
//     }
//   }
// }

