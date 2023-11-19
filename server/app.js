const Ws = require("ws");
const print = require('./print');
const config = require('./config').printer1;

const queue = [];

const doQueue = async () => {
  while (queue.length > 0) {
    const { text, time } = queue[0];
    print(text, config);
    queue.shift();
    console.log('doQueue', text);
    await new Promise(r => setTimeout(r, time));
  }
};

const onReceive = (e) => {
  const { type, value } = JSON.parse(e);
  console.log(value);
  if (type == 'start') {
    const { places, dates } = value;
    queue.push({ time: 5000, text: "TODO:印刷内容" });
  } else if (type == 'end') {
    const url = value;
    queue.push({ time: 3000, text: "TODO:印刷内容" });
  } else if (type == 'diary') {
    const text = value;
    queue.push({ time: 1500, text: `|${text}` });
  } else if (type == 'image') {
    const date = value;
    // const base64Str = IMAGES[date]
    queue.push({ time: 3000, text: "TODO:印刷内容" });
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