
const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 3000;

const vapidKeys = {
  publicKey: 'BHE3Z2smqtnqAxQydOUFx3r7I9j4tYiZYo5cGxXKzGRWZP6UDikTcU3CyZ88Emk3GgBQ9mA7aL2JHfgBESWnCjA',
  privateKey: 'XnkRzdgbYDYszgoDPNCSKEZjO9e6pvW3472Ykg7jDYs'
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



app.get('/test', (req, res) => {
  if (!fs.existsSync(SUBS_FILE)) return res.status(404).send('登録情報が見つかりません');
  const subs = JSON.parse(fs.readFileSync(SUBS_FILE));
  if (!subs.length) return res.status(400).send('通知対象がありません');

  const sub = subs[0];
  const payload = JSON.stringify({
    title: 'ぐるぐるテスト通知',
    body: 'これはテストです！ちゃんと届くかな？',
    icon: 'https://tasuketekure.github.io/guruguru_app/guruguru_icon.png'
  });

  webpush.sendNotification(sub, payload)
    .then(() => res.send('通知を送信しました！'))
    .catch(err => {
      console.error('通知失敗:', err);
      res.status(500).send('通知に失敗しました');
    });
});


app.listen(PORT, () => {
  console.log(`ぐるぐる通知サーバーが起動しました http://localhost:${PORT}`);
});
