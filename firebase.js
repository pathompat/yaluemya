const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 80;

// Import the appropriate class
const {
  WebhookClient
} = require('dialogflow-fulfillment');

app.use(morgan('dev'))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    if (STATUS == 0) res.status(204).send({ msg: "no content" });
    else res.send(DATA);
});

app.get("/getActive", (req, res) => {
    if (STATUS == 0) res.status(204).send("no content");
    else res.send(DATA);
});

app.post("/", (req, res) => {
    const data = req.body.LightActive;
    DATA = data;
    STATUS = 1;
    res.json("Success: " + DATA);
});

app.get("/close", (req, res) => {
    STATUS = 0;
    res.status(202).json("Close Success");
});

app.get("/web", function (req, res) {
    res.sendFile("./index.html", { root: __dirname });
});

app.listen(process.env.PORT, () => {
    console.log("Open server");
});

app.post('/webhook', (req, res) => {
  console.log('POST: /');
  console.log('Body: ',req.body);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  //Test get value of WebhookClient
  console.log('agentVersion: ' + agent.agentVersion);
  console.log('intent: ' + agent.intent);
  console.log('locale: ' + agent.locale);
  console.log('query: ', agent.query);
  console.log('session: ', agent.session);

  //Function Location
  function location(agent) {
    agent.add('Welcome to Thailand.');
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Location', location);  // "Location" is once Intent Name of Dialogflow Agent
  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});