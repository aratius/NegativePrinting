
'use client';

import { useEffect, useRef, useState } from 'react';
import Youtube from 'react-youtube';
import DIARIES from '@/const/diary';

const playlists = [
  {
    date: '0902',
    videoId: 'zSN_3WRS0r0',
  },
  {
    date: '0903',
    videoId: 'ewt0J_BSR_E',
  },
  {
    date: '0904',
    videoId: 'cikPU_fCAH8',
  },
  {
    date: '0905',
    videoId: 'guDzeER7RjI',
  },
  {
    date: '0906-0910',
    videoId: '_XosdLBt9vc',
  },
  {
    date: '0911',
    videoId: 'sLQVkIbVun4',
  },
  {
    date: '0912',
    videoId: 'AkaJMVZld04',
  },
  {
    date: '0913',
    videoId: 'qG38FfwB1X4',
  },
  {
    date: '0914',
    videoId: '',
  },
  {
    date: '0915',
    videoId: 'kw5D-B49LOs',
  },
  {
    date: '0916',
    videoId: 'd4_FkObm6Vs',
  },
  {
    date: '0917',
    videoId: 'vDswHcTBzYM',
  },
  {
    date: '0918',
    videoId: 'lZrYVpWBV3g',
  },
  {
    date: '0919',
    videoId: '-xwHQeEP_UM',
  },
  {
    date: '0920',
    videoId: '59yFXu5beAI',
  },
  {
    date: '0921',
    videoId: '',
  },
  {
    date: '0922',
    videoId: 'bq3vwCjMf84',
  },
  {
    date: '0923',
    videoId: 'YbTTlkOiZbI',
  },
  {
    date: '0924',
    videoId: 'jdYluBNZZ8s',
  },
  {
    date: '0925',
    videoId: 'dxhdxshLLPM',
  },
  {
    date: '0926',
    videoId: 'qs2ak4K9wms',
  },
  {
    date: '0927',
    videoId: '5HBEaO3wG9U',
  },
  {
    date: '0928',
    videoId: '6E9TKc5SRXw',
  },
  {
    date: '0929',
    videoId: 'o8BjDJL_OLE',
  },
  {
    date: '0930',
    videoId: 'Vr1pIbPVL5I',
  },
  {
    date: '1001-1002',
    videoId: '7rDiESnhMKA',
  }
];

export default function Home() {
  const player = useRef(null);
  const timerId = useRef(null);
  const sock = useRef(null);
  const prevProg = useRef(1);
  const [initialized, setInitialized] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (timerId.current != null) clearInterval(timerId.current);
    timerId.current = setInterval(checkTime, 100);

    const onMsg = msg => console.log(msg);
    const onOpen = e => console.log("Socket connected");

    sock.current = new WebSocket("ws://127.0.0.1:3030");
    sock.current.addEventListener("open", onOpen);
    sock.current.addEventListener("message", onMsg);

    return () => {
      if (timerId.current != null) clearInterval(timerId.current);
      sock.current.removeEventListener("open", onOpen);
      sock.current.removeEventListener("message", onMsg);
    };
  });

  const print = (type, value) => {
    console.log('print', JSON.stringify(value));
    // TODO: ws send
    sock.current.send(JSON.stringify({ type, value }));
  };

  const checkPrint = (key, prog) => {
    const diary = DIARIES[key];
    const texts = [];
    const CHARS_PER_LINE = 35;
    const splitedText = diary.text.split('\n');
    for (let i = 0; i < splitedText.length; i++) {
      const text = splitedText[i];
      const chars = text.split('');
      let t = '';
      let charnum = 0;
      for (let j = 0; j < chars.length; j++) {
        const char = chars[j];
        // 半角なら+1, 全角なら+2
        const thisCharNum = char.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? 2 : 1
        charnum += thisCharNum;
        if (charnum > CHARS_PER_LINE) {
          texts.push(t);
          t = '';
          charnum = thisCharNum;
        }
        t += chars[j];
      }
      if (t != '') texts.push(t);
    }
    const prevIndex = Math.floor(prevProg.current * texts.length);
    const crrIndex = Math.floor(prog * texts.length);
    const { places, dates, note } = diary;
    if (prevIndex > crrIndex) {
      // TODO: 最初のお決まりプリント
      // 最初
      print('start', { places, dates });
      print('diary', texts[0]);
    } else if (prevIndex < crrIndex) {
      if (crrIndex < texts.length) {
        // TODO: 進捗に応じて日記プリント
        // 途中
        print('diary', texts[crrIndex]);

        // TODO: 画像差し込む
        // print('image', key);
      } else {
        // TODO: 最後にQRとバーコード
        // 最後
        print('image', key);
        print('end', note);
      }
    }
    // TODO: たまに画像を差し込む
    prevProg.current = prog;
  };

  const checkTime = async () => {
    if (player.current == null) return;
    const [i, t, d] = await Promise.all([
      player.current.getPlaylistIndex(),
      player.current.getCurrentTime(),
      player.current.getDuration()
    ]);
    if (i == undefined || t == undefined || d == undefined || d == 0) return;
    const remains = d - t;
    if (remains < 1) setOpacity(0);
    const key = playlists[i].date;
    const prog = t / d;
    checkPrint(key, prog);
  };

  const onReady = async (e) => {
    console.log('ready', e);
    player.current = e.target;
    const list = playlists.map(k => k.videoId).filter(v => v != '');
    await player.current.loadPlaylist(list);
  };

  const onError = (e) => {
    console.log('err', e);
  };

  const onEnd = (e) => {
    console.log('end', e);
    // ループ再生
    player.current.playVideoAt(0);
  };

  const onStateChange = (e) => {
    console.log('state', e);
    if (e.data == 1) {
      // NOTE: Youtube UI見えちゃう問題のため最初4.5secは真っ暗映像にしてあります
      setTimeout(() => {
        setOpacity(1);
      }, 4500);
    }
  };

  return (
    <>
      {
        initialized ?
          <Youtube
            videoId=''
            onReady={onReady}
            onError={onError}
            onEnd={onEnd}
            onStateChange={onStateChange}
            opts={{
              width: innerWidth,
              height: innerHeight,
              playerVars: {
                autoplay: 1,
                playsinline: 0,
                controls: 1
              }
            }}
            style={{ opacity }}
          ></Youtube> :
          <a href='#' onClick={(e) => setInitialized(true)}>init</a>
      }
    </>
  );
}
