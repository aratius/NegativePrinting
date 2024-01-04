const firebase = require('firebase/app');
const { getDatabase, onValue, ref } = require('firebase/database');
const DIARIES = require('./diary');
const print = require('./print');
const config = require('./config').printer1;
const IMAGES = require('./images/js/images');
const { getHeader, getFooter, getText } = require("./receipt");

let crrIndex = 0;

const setPrintData = () => {
  const key = Object.keys(DIARIES)[crrIndex];
  const data = DIARIES[key];

  const text = `${getHeader(data.places, data.dates)}${getText(data.text)}${getFooter(data.note)}`;
  console.log(text);
  print(text, config);

  crrIndex++;
  crrIndex = crrIndex % Object.keys(DIARIES).length;
};

const init = () => {

  // Firebaseの設定
  const firebaseConfig = {
    databaseURL: "https://kuma-experiment-default-rtdb.firebaseio.com/"
  };

  // Firebaseの初期化
  const app = firebase.initializeApp(firebaseConfig);

  const db = getDatabase(app);

  const printingDataRef = ref(db, '/');

  const unsubscribe = onValue(printingDataRef, (snapshot) => {
    const data = snapshot.val();
    for (const key in data) {
      if (data[key].printed) continue;
      ref(db, `/${key}`).set({
        ...data[key],
        printed: true
      });
      setPrintData();
    }
  });

  // Ctrl+Cが押された時のイベント
  process.on('SIGINT', () => {
    console.log('SIGINTが検出されました（Ctrl+C）。');
    // 必要なクリーンアップ操作をここに実装
    unsubscribe();
    process.exit();
  });

  // システムによる終了要求（SIGTERM）のイベント
  process.on('SIGTERM', () => {
    console.log('SIGTERMが検出されました。');
    // 必要なクリーンアップ操作をここに実装
    unsubscribe();
    process.exit();
  });

  // 未捕捉の例外が発生した時のイベント
  process.on('uncaughtException', (err) => {
    console.error('未捕捉の例外が発生しました:', err);
    // 必要なクリーンアップ操作をここに実装
    unsubscribe();
    process.exit(1);
  });
};

init();