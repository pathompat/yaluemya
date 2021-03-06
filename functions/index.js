const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");
const cors = require("cors");

// var serviceAccount = require("./x-group-290609-firebase-adminsdk-wq05l-5ff9d8dcd1.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://x-group-290609-default-rtdb.firebaseio.com"
// });
// admin.initializeApp();
// const db = admin.firestore();

// const bucket = admin.storage().bucket();
const firebaseConfig = {
  apiKey: "AIzaSyBJZmKIWVmVntsjpsGJB39TtDh1c2ZgkYE",
  authDomain: "x-group-290609.firebaseapp.com",
  databaseURL: "https://x-group-290609-default-rtdb.firebaseio.com",
  projectId: "x-group-290609",
  storageBucket: "x-group-290609.appspot.com",
  messagingSenderId: "416776513876",
  appId: "1:416776513876:web:bb414252985afd3291c0c1",
};

firebase.initializeApp(firebaseConfig);

// module.exports = { admin, db, bucket };

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const express = require("express");
const app = express();
app.use(cors());
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT || 80;
let STATUS = 0;
let DATA = "";

let database = [
  {
    UID: "U365da0cf545d9f2b32c78ec49d83d631",
    displayName: "มันนี่",
    data: [
      // {
      //   name: "Paracetamol 500 Mg",
      //   time: [
      //     {
      //       title: "เช้า",
      //       Hm: "08:30",
      //       status: false,
      //     },
      //     {
      //       title: "กลางวัน",
      //       Hm: "12:30",
      //       status: false,
      //     },
      //     {
      //       title: "เย็น",
      //       Hm: "18:30",
      //       status: false,
      //     },
      //   ],
      //   detail: "ครั้งละ 1 เม็ดก่อนอาหาร",
      //   tag: "#f09eff",
      //   index: 1,
      // },
      // {
      //   name: "Aspirin 250 Mg",
      //   time: [
      //     {
      //       title: "เช้า",
      //       Hm: "08:30",
      //       status: false,
      //     },
      //     {
      //       title: "เย็น",
      //       Hm: "18:30",
      //       status: false,
      //     },
      //   ],
      //   detail: "ครั้งละ 2 เม็ดก่อนอาหาร",
      //   tag: "#009e00",
      //   index: 2,
      // },
    ],
  },

  {
    UID: "U97c1f0227ae7eba2ff0cfb95b0a35fd4",
    displayName: "Test 2",
    data: [
      {
        name: "Paracetamol",
        time: [
          {
            title: "เช้า",
            Hm: "08:30",
            status: false,
          },
          {
            title: "กลางวัน",
            Hm: "12:30",
            status: false,
          },
        ],
        detail: null,
        tag: "#f09e00",
        index: 2,
      },
    ],
  },
  {
    UID: "2",
    displayName: "ยายเพ็ญ",
    data: [
      {
        name: "Paracetamol 500 Mg",
        time: [
          {
            title: "เช้า",
            Hm: "08:30",
            status: false,
          },
          {
            title: "กลางวัน",
            Hm: "12:30",
            status: false,
          },
          {
            title: "เย็น",
            Hm: "18:30",
            status: false,
          },
        ],
        detail: "ครั้งละ 1 เม็ดก่อนอาหาร",
        tag: "#f09eff",
        index: 1,
      },
      {
        name: "Aspirin 250 Mg",
        time: [
          {
            title: "เช้า",
            Hm: "08:30",
            status: false,
          },
          {
            title: "เย็น",
            Hm: "18:30",
            status: false,
          },
        ],
        detail: "ครั้งละ 2 เม็ดก่อนอาหาร",
        tag: "#009e00",
        index: 2,
      },
    ],
  },
];

const getMydata = (UID) => {
  let userData;
  database.forEach((item) => {
    if (item.UID == UID) userData = item;
  });
  return userData;
};

// Import the appropriate class
const { WebhookClient } = require("dialogflow-fulfillment");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  if (STATUS == 0) res.status(204).send({ msg: "no content" });
  else res.send(DATA);
});

app.post("/", (req, res) => {
  const data = req.body.LIST_LIGHT;
  DATA = data;
  STATUS = 1;
  res.json("Success: " + DATA);
});

app.post("/getMyData", (req, res) => {
  const UID = req.body.UID;
  const userData = getMydata(UID);
  res.json(userData);
});

app.post("/deletePill", (req, res) => {
  const UID = req.body.UID;
  const index = req.body.index;
  let iUser = null;
  database.forEach((item, i) => {
    if (item.UID == UID) iUser = i;
  });
  database[iUser].data.splice(index, 1);
  res.json(database[iUser]);
});

app.get("/getAll", (req, res) => {
  res.json(database);
});

app.post("/postMyData", (req, res) => {
  const UID = req.body.UID;
  const displayName = req.body.displayName || undefined;
  const pills = req.body.data || undefined;
  console.log(pills);
  let index = null;
  database.forEach((item, i) => {
    if (item.UID == UID) index = i;
  });

  if (index == null) {
    database.push({ UID, displayName, data: [pills] });
    res.json({ UID, displayName, data: pills });
  } else {
    database[index].data.push(pills);
    res.json(database[index]);
  }
});

app.get("/web", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/close", (req, res) => {
  STATUS = 0;
  res.status(202).json("Close Success");
});

app.get("/web", function (req, res) {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/data", function (req, res) {
  // let response = [];
  // const refData = db.collection('data')
  // refData.get().then(result => {
  //     result.forEach(doc => console.log(doc.data))
  //     response.push(doc.data)
  // }).then(result => res.json(response)).catch(err => res.json({err}))
  // res.sendFile("./index.html", { root: __dirname });
  res.json(database);
});

app.post("/webhook", (req, res) => {
  //   console.log('POST: /');
  //   console.log('Body: ',req.body);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  //Test get value of WebhookClient
  //   console.log('agentVersion: ' + agent.agentVersion);
  //   console.log('intent: ' + agent.intent);
  //   console.log('locale: ' + agent.locale);
  //   console.log('query: ', agent.query);
  //   console.log('session: ', agent.session);
  //   console.log(req.user)

  //Function Location
  //   function location(agent) {
  //     agent.add('Welcome to Thailand.');
  //   }

  function hasTakenMedicine() {
    // console.log(agent.originalDetectIntentRequest.payload.data.source.userId);
    const payload = req.body.originalDetectIntentRequest.payload;
    const time = payload.data.message.text.split(" ")[1];
    const userId = payload.data.source.userId
    console.log(time)
    console.log(payload.data.source.userId)
    const user = database.findIndex(e => userId === e.UID)
    // console.log(user)
    // const user = user.data.forEach(item => {
    //   // const index = item.findIndex(e => e.title === time)
    //   // if(index > -1){
    //     database[user].item[index]
    //   }
    // })
    // const result = user.find(e => {

    // })
    
    STATUS = 0;
    agent.add(`เก่งมาก`);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  //   intentMap.set('Location', location);  // "Location" is once Intent Name of Dialogflow Agent
  intentMap.set("Has Taken Medicine", hasTakenMedicine);
  agent.handleRequest(intentMap);
});

exports.apiNutin = functions.region("asia-east2").https.onRequest(app);
