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


    const requestUserName = (id) => {
      const qs = 'access_token=' + encodeURIComponent(process.env.PAGE_ACCESS_TOKEN);
      return fetch('https://graph.facebook.com/v2.8/' + encodeURIComponent(id) +'?' + qs)
      .then(rsp => rsp.json())
      .then(json => {
        if (json.error && json.error.message) {
          throw new Error(json.error.message);
        }
        return json;
      });
    };
    console.log(requestUserName(sender_psid));

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
  if (payload === 'size') 
      response = { 
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"How large?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"small",
                        "payload": "quantity" 
                      },
                      {
                        "type":"postback",
                        "title":"medium",
                        "payload": "quantity" 
                      },
                      {
                        "type":"postback",
                        "title":"large",
                        "payload": "quantity" 
                      }
                    ]
                  }
                }
      }
  else if(payload === 'Non-veg') 
      response={
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"generic",
                      "elements":[
                        {
                          "title":"Cheese & Pepperoni",
                          "image_url":"http://www.tasteepizza.com/wp-content/uploads/2018/03/Pizza-HD-Desktop-Wallpaper-15280-300x201.jpg",
                          "subtitle":"Pepperoni & Cheese-100% Pork Pepperoni",
                          "default_action": {
                            "type": "web_url",
                            "url": "https://yoyopizza.com",
                            "webview_height_ratio": "tall",
                          },
                          "buttons":[
                          {
                              "type":"postback",
                              "title":"Select Cheese & Pepperoni",
                              "payload":"size"
                            }              
                          ]      
                        },
                        {
                          "title":"Florence Chicken Exotica",
                          "image_url":"http://www.tasteepizza.com/wp-content/uploads/2018/03/large-cheese-pizza-300x228.jpg",
                          "subtitle":"Barbeque chicken, Italian chicken sausage & Jalapeno",
                          "default_action": {
                            "type": "web_url",
                            "url": "https://yoyopizza.com",
                            "webview_height_ratio": "tall",
                          },
                          "buttons":[
                          {
                              "type":"postback",
                              "title":"Select Exotica",
                              "payload":"size"
                            }              
                          ]      
                        },
                        {
                          "title":"Chicken Mexicana",
                          "image_url":"http://www.tasteepizza.com/wp-content/uploads/2018/03/slider-img-4-300x222.jpg",
                          "subtitle":"Onion, Fresh Tomato, Red Paprika, chicken sprinkled with mexican herbs.",
                          "default_action": {
                            "type": "web_url",
                            "url": "https://yoyopizza.com",
                            "webview_height_ratio": "tall",
                          },
                          "buttons":[
                          {
                              "type":"postback",
                              "title":"Select Mexicana",
                              "payload":"size"
                            }              
                          ]      
                        }
                      ]
                    }
                  }
               }

  
  else if (payload === 'veg')
      response = {
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"generic",
                    "elements":[
                      {
                        "title":"Peppy Paneer",
                        "image_url":"http://www.tasteepizza.com/wp-content/uploads/2018/03/slider-img-1-150x150.jpg",
                        "subtitle":"Paneer, Crisp Capsicum & Red Paprika",
                        "default_action": {
                          "type": "web_url",
                          "url": "https://yoyopizza.com",
                          "webview_height_ratio": "tall",
                        },
                        "buttons":[
                         {
                            "type":"postback",
                            "title":"Select Peppy Paneer",
                            "payload":"size"
                          }              
                        ]      
                      },
                      {
                        "title":"Double Cheese Margarita",
                        "image_url":"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/190226-buffalo-chicken-pizza-370-1552084943.jpg?crop=0.668xw:1.00xh;0.209xw,0.00255xh&resize=768:*",
                        "subtitle":"Loaded with extra cheese",
                        "default_action": {
                          "type": "web_url",
                          "url": "https://yoyopizza.com",
                          "webview_height_ratio": "tall",
                        },
                        "buttons":[
                         {
                            "type":"postback",
                            "title":"Select Margarita",
                            "payload":"size"
                          }              
                        ]      
                      },
                      {
                        "title":"Country Special",
                        "image_url":"https://d37ky63zmmmzfj.cloudfront.net/production/itemimages/special_snacks/pizza/paneervegpizza_1no.jpg",
                        "subtitle":"Onion, Crisp Capsicum & Fresh Tomato",
                        "default_action": {
                          "type": "web_url",
                          "url": "https://yoyopizza.com",
                          "webview_height_ratio": "tall",
                        },
                        "buttons":[
                         {
                            "type":"postback",
                            "title":"Select Country Special",
                            "payload":"size"
                          }              
                        ]      
                      }
                    ]
                  }
                }
      }

  //getQuantity        
  else if (payload === 'quantity')
              response = { 
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"How many?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"1",
                        "payload": "getName" 
                      },
                      {
                        "type":"postback",
                        "title":"2",
                        "payload": "getName" 
                      },
                      {
                        "type":"postback",
                        "title":"5",
                        "payload": "getName" 
                      }
                    ]
                  }
                }
            }

                  //get username
          else if (payload === 'getName')
          response = { 
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":`Got it. Let me just take your info. First up, what's your name?`,
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Type your name. Eg: soundar surya",
                    "payload": "getMob" 
                  }
                ]
              }
            }
        }

        //getMob
        else if (payload === 'gtMob')
        response = { 
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":`Your mobile number?`,
              "buttons":[
                {
                  "type":"postback",
                  "payload": "getAddress" 
                }
              ]
            }
          }
        }

        else if (payload === 'getAddress')
          response = { 
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":`Finally the delivery address?`,
                "buttons":[
                  {
                    "type":"postback",
                    "title": "Type your current address",
                    "payload": "deadline" 
                  }
                ]
              }
            }
        }

              //delivery timestamp        
        else if (payload === 'deadline')
        response = { 
        "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":"when do you want it?",
          "buttons":[
            {
              "type":"postback",
              "title":"ASAP(30 min)",
              "payload": "placeOrder" 
            },
            {
              "type":"postback",
              "title":"in an hour",
              "payload": "placeOrder" 
            },
            {
              "type":"postback",
              "title":"in 1.5 hour",
              "payload": "placeOrder" 
            },
            {
              "type":"postback",
              "title":"in 2 hour",
              "payload": "placeOrder" 
            },
            {
              "type":"postback",
              "title":"in 3 hour",
              "payload": "placeOrder" 
            }
          ]
        }
        }
        }

        //placeOrder
        else if (payload === 'placeOrder')
                response = { 
                  "text":`Awesome, Your order is placed. You'll soon get a call for confirmation`,
              }


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

  let pattern = /^[0-9]{10}$/g;

  if( message && message.attachments && message.attachments[0].payload){
      callSendAPI(sender_psid, "wow, you're so sweet");
      return;
  }

    if(message.text === "Pick One"){
                            let response = {
                              "attachment": {
                                "type": "template",
                                "payload": {
                                  "template_type": "button",
                                  "text": "What kind of pizza do you want?",
                                    "buttons": [
                                      {
                                        "type": "postback",
                                        "title": "regular",
                                        "payload": "regular",
                                      },
                                      {
                                        "type": "postback",
                                        "title": "medium",
                                        "payload": "medium",
                                      },
                                    ],
                                }
                              }
                            }
                callSendAPI(sender_psid, response);  
    }
    else if(pattern.test(message.text)){
            callSendAPI(sender_psid, 'enter number with coutry code');
    }
    else{
          let entitiesArr = [ "wit$greetings", "wit$thanks", "wit$bye", "wit$phone_number", "wit$datetime"];
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
                        "text": "Hola! Welcome to Yo Yo Pizza! What kind of pizza do you want?",
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
                  callSendAPI(sender_psid,'bye bye!');
              }
                   }
          } }


module.exports = {
    test,
    getWebhook,
    postWebhook,
}

