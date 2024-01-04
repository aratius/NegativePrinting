const open = require("open");
const { exec } = require('child_process');

exec("npx kill-port --port 3000 && pnpm run dev");
console.log("### exec command : kill-port --port 3000 && npm run dev");

// kioskで立ち上げ(Windowsのみ)
exec("\"C:/Program Files/Google/Chrome/Application/chrome.exe\" --kiosk --disable-pinch --incognito \"http://localhost:3000/yt\"");
console.log("### \"C:/Program Files/Google/Chrome/Application/chrome.exe\" --kiosk --disable-pinch --incognito \"http://localhost:3000/yt\"");