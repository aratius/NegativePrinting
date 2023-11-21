const open = require("open");
const { exec } = require('child_process');

exec("npx kill-port --port 3000 && pnpm run dev");
console.log("### exec command : kill-port --port 3000 && npm run dev");
open("http://localhost:3000/");
console.log("### open browser : http://localhost:3000/");