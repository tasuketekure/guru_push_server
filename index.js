
const webpush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const vapidKeys = {
  publicKey: "BEud2gHYTUZS2cO4h5dyu9z9zMROnDqMENbKPZtVfGgCA-Dbb_uP8XRx4BLkiNqu7kTVKgYKrLRCdKu0zZZvQo",
  privateKey: "34byiXaVkMtnA9XifyURgkRjeIGY5cygWFZPior-oLg"
};

webpush.setVapidDetails(
  "mailto:example@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

let subscription = null;

app.post("/subscribe", (req, res) => {
  subscription = req.body;
  console.log("登録された購読情報:", subscription);
  res.status(201).json({ message: "登録しました！" });
});

app.get("/test", (req, res) => {
  if (!subscription) {
    return res.status(404).json({ error: "購読情報がありません。" });
  }

  const payload = JSON.stringify({ title: "歯みがきのお時間です" });

  webpush.sendNotification(subscription, payload)
    .then(() => res.status(200).json({ message: "通知を送りました！" }))
    .catch(err => {
      console.error("通知エラー:", err);
      res.sendStatus(500);
    });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`ぐるぐる通知サーバーが起動しました http://localhost:${port}`);
});
