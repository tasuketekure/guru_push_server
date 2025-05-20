
const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 3000;

const vapidKeys = {
  publicKey: 'BB3Mc9VR_Tj9DypraDusDBQ596f45Qj1FVxEh-nVNEXTaalxFteqwOMa1dI9yW_5DGfGknnDa0tYePw5aW4oAWg',
  privateKey: '5sfJDchWoVWnqwROxFYxYMVvdrHSEJ49sPn4wvEvI5Q'
};

webpush.setVapidDetails(
  'mailto:example@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());

const SUBS_FILE = 'subscriptions.json';

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  let subs = [];

  if (fs.existsSync(SUBS_FILE)) {
    subs = JSON.parse(fs.readFileSync(SUBS_FILE));
  }

  if (!subs.find(s => s.endpoint === sub.endpoint)) {
    subs.push(sub);
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
  }

  res.status(201).json({});
});

cron.schedule('30 11 * * *', () => {
  if (!fs.existsSync(SUBS_FILE)) return;
  const subs = JSON.parse(fs.readFileSync(SUBS_FILE));
  subs.forEach(sub => {
    webpush.sendNotification(sub, JSON.stringify({
      title: 'ぐるぐる',
      body: '……そろそろ、はみがき……してみない……？',
      icon: 'https://tasuketekure.github.io/guruguru_app/guruguru_icon.png'
    })).catch(err => console.error("Failed:", err));
  });
});

app.listen(PORT, () => {
  console.log(`ぐるぐる通知サーバーが起動しました http://localhost:${PORT}`);
});
