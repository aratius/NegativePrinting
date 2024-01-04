const Ws = require("ws");
const print = require('./print');
const config1 = require('./config').printer1;
const config2 = require('./config').printer2;
const IMAGES = require('./images/js/images');
const { getHeader, getFooter, getText } = require("./receipt");

const queue = [];

const doQueue = async () => {
  while (queue.length > 0) {
    const { text, time } = queue[0];
    print(text, config1);
    console.log('doQueue', time);
    await new Promise(r => setTimeout(r, time));
    queue.shift();
  }
};

const onReceive = (e) => {
  const { type, value, time } = JSON.parse(e);
  console.log(JSON.parse(e));
  if (type == 'start') {
    const { places, dates } = value;
    queue.push({ time, text: getHeader(places, dates) });
  } else if (type == 'end') {
    const url = value;
    queue.push({ time, text: getFooter(url) });
  } else if (type == 'diary') {
    const text = value;
    queue.push({ time, text: getText(text) });
  } else if (type == 'image') {
    const date = value;
    const base64StrList = IMAGES[date];
    if (base64StrList.length > 0) queue.push({ time, text: `\n\n{image:${base64StrList[Math.floor(Math.random() * base64StrList.length)]}}` });
  }

  if (queue.length == 1) doQueue();
};

const main = async () => {
  const wsServer = new Ws.Server({ port: 3030 });
  await new Promise((res, rej) => {
    wsServer.on("connection", (ws) => {
      console.log("### ws connected");
      ws.on("message", onReceive);
      res();
    });
  });
};

main();