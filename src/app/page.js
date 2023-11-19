
'use client';

import { useEffect, useRef, useState } from 'react';
import Youtube from 'react-youtube';
import DIARIES from '@/const/diary';

const playlists = [
  {
    date: '0902',
    videoId: 'zSN_3WRS0r0',
    note: 'https://note.com/aualrxse/n/n49ae21719f46?sub_rt=share_crp'
  },
  {
    date: '0903',
    videoId: 'ewt0J_BSR_E',
    note: 'https://note.com/aualrxse/n/n3d02efcfd643?sub_rt=share_crp'
  },
  {
    date: '0904',
    videoId: 'cikPU_fCAH8',
    note: 'https://note.com/aualrxse/n/nd05f9a02fe2c?sub_rt=share_crp'
  },
  {
    date: '0905',
    videoId: 'guDzeER7RjI',
    note: 'https://note.com/aualrxse/n/ncee05d3add9e?sub_rt=share_crp'
  },
  {
    date: '0906-0910',
    videoId: '_XosdLBt9vc',
    note: 'https://note.com/aualrxse/n/nb3921dc7c13e?sub_rt=share_crp'
  },
  {
    date: '0911',
    videoId: 'sLQVkIbVun4',
    note: 'https://note.com/aualrxse/n/n44485284207e?sub_rt=share_crp'
  },
  {
    date: '0912',
    videoId: 'AkaJMVZld04',
    note: 'https://note.com/aualrxse/n/nceb7d0281c3f?sub_rt=share_crp'
  },
  {
    date: '0913',
    videoId: 'qG38FfwB1X4',
    note: 'https://note.com/aualrxse/n/nd5ae1b2c4d62?sub_rt=share_crp'
  },
  {
    date: '0914',
    videoId: '',
    node: 'https://note.com/aualrxse/n/na83548e5eb09?sub_rt=share_crp'
  },
  {
    date: '0915',
    videoId: 'kw5D-B49LOs',
    note: 'https://note.com/aualrxse/n/nde3854c42a4d?sub_rt=share_crp'
  },
  {
    date: '0916',
    videoId: 'd4_FkObm6Vs',
    note: 'https://note.com/aualrxse/n/nc98a58a37439?sub_rt=share_crp'
  },
  {
    date: '0917',
    videoId: 'vDswHcTBzYM',
    note: 'https://note.com/aualrxse/n/n6d16c0fc22b0?sub_rt=share_crp'
  },
  {
    date: '0918',
    videoId: 'lZrYVpWBV3g',
    note: 'https://note.com/aualrxse/n/n8cfa53442e0e?sub_rt=share_crp'
  },
  {
    date: '0919',
    videoId: '-xwHQeEP_UM',
    note: 'https://note.com/aualrxse/n/n72689ee7fbbd?sub_rt=share_crp'
  },
  {
    date: '0920',
    videoId: '59yFXu5beAI',
    note: 'https://note.com/aualrxse/n/ne5517d80ecce?sub_rt=share_crp'
  },
  {
    date: '0921',
    videoId: '',
    node: 'https://note.com/aualrxse/n/nf48818b17450?sub_rt=share_crp'
  },
  {
    date: '0922',
    videoId: 'bq3vwCjMf84',
    note: 'https://note.com/aualrxse/n/n03955147dc23?sub_rt=share_crp'
  },
  {
    date: '0923',
    videoId: 'YbTTlkOiZbI',
    note: 'https://note.com/aualrxse/n/n5e7fbb6a31a8?sub_rt=share_crp'
  },
  {
    date: '0924',
    videoId: 'jdYluBNZZ8s',
    note: 'https://note.com/aualrxse/n/nd75b1fc9be1b?sub_rt=share_crp'
  },
  {
    date: '0925',
    videoId: 'dxhdxshLLPM',
    note: 'https://note.com/aualrxse/n/n9185fb13405b?sub_rt=share_crp'
  },
  {
    date: '0926',
    videoId: 'qs2ak4K9wms',
    note: 'https://note.com/aualrxse/n/n49878778d5b4?sub_rt=share_crp'
  },
  {
    date: '0927',
    videoId: '5HBEaO3wG9U',
    note: 'https://note.com/aualrxse/n/nddc7b2250af7?sub_rt=share_crp'
  },
  {
    date: '0928',
    videoId: '6E9TKc5SRXw',
    note: 'https://note.com/aualrxse/n/ndfdee850149f?sub_rt=share_crp'
  },
  {
    date: '0929',
    videoId: 'o8BjDJL_OLE',
    note: 'https://note.com/aualrxse/n/n8081056eca23?sub_rt=share_crp'
  },
  {
    date: '0930',
    videoId: 'Vr1pIbPVL5I',
    note: 'https://note.com/aualrxse/n/n4f186c3f2bca?sub_rt=share_crp'
  },
  {
    date: '1001-1002',
    videoId: '7rDiESnhMKA',
    note: 'https://note.com/aualrxse/n/n9845b98d615d?sub_rt=share_crp'
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
    const CHARS_PER_LINE = 46;
    const splitedText = diary.text.split('\n');
    for (let i = 0; i < splitedText.length; i++) {
      const text = splitedText[i];
      const chars = text.split('');
      let t = '';
      let charnum = 0;
      for (let j = 0; j < chars.length; j++) {
        const char = chars[j];
        // 半角なら+1, 全角なら+2
        charnum += char.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? 2 : 1;
        if (charnum > CHARS_PER_LINE) {
          texts.push(t);
          t = '';
          charnum = 0;
        }
        t += chars[j];
      }
      if (t != '') texts.push(t);
    }
    const prevIndex = Math.floor(prevProg.current * (texts.length + 1));
    const crrIndex = Math.floor(prog * (texts.length + 1));
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
