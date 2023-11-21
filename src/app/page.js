
'use client';

import { useEffect, useRef, useState } from 'react';
import Youtube from 'react-youtube';
import DIARIES from '@/const/diary';

const playlists = [
  {
    date: '0902',
    videoId: 'ISdpHdfxhTY',
  },
  {
    date: '0903',
    videoId: 'JWeOzdrO7B8',
  },
  {
    date: '0904',
    videoId: '9bT4mhpDYWg',
  },
  {
    date: '0905',
    videoId: 'Wg2fRKXR1FM',
  },
  {
    date: '0906-0910',
    videoId: 'vlkc6pVl--k',
  },
  {
    date: '0911',
    videoId: 'PsO-xDAZDiY',
  },
  {
    date: '0912',
    videoId: 'sIAifV4Kw9Q',
  },
  {
    date: '0913',
    videoId: 'GCeHdLQlOyY',
  },
  {
    date: '0914',
    videoId: 'A8EZKgzQf0o'
  },
  {
    date: '0915',
    videoId: 'n5E6wsp1Qvk',
  },
  {
    date: '0916',
    videoId: '5QYbEa6UY9Q',
  },
  {
    date: '0917',
    videoId: 'zBqY0LAciTA',
  },
  {
    date: '0918',
    videoId: 'aGHCr2fUMcc',
  },
  {
    date: '0919',
    videoId: 'jvBGcBRoGF4',
  },
  {
    date: '0920',
    videoId: 'ElDk2UtWZ38',
  },
  {
    date: '0921',
    videoId: 'YPrZBt9G2NA'
  },
  {
    date: '0922',
    videoId: 'bFMDMzbghVE',
  },
  {
    date: '0923',
    videoId: '8YmFsYthI3w',
  },
  {
    date: '0924',
    videoId: '9H3MDh2_A8U',
  },
  {
    date: '0925',
    videoId: '5H-aMfhGeo8',
  },
  {
    date: '0926',
    videoId: 'oy7eD2gpxD4',
  },
  {
    date: '0927',
    videoId: 'KaWhFB3FNRU',
  },
  {
    date: '0928',
    videoId: '9ZL5O5dUNyY',
  },
  {
    date: '0929',
    videoId: 'fwty_hLiwVo',
  },
  {
    date: '0930',
    videoId: 'BO5E4VHibEA',
  },
  {
    date: '1001-1002',
    videoId: 'xvK3eXfZTIA',
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
