const webpush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: "BMbdqOSU4gN7v_gHzO5NT2Gb0Pdgh_A20VSo1DPOb8oGNmTqDmjLCgrH_a7bka5NgQwvhZC9J4H-cbD6KvS0qXs",
  privateKey: "PT7m1-K_ThgdP0LFsQANZacqaFzCipmVe44rUwLDmng"
};

webpush.setVapidDetails("mailto:example@example.com", vapidKeys.publicKey, vapidKeys.privateKey);

let currentSubscription = null;

app.post("/subscribe", (req, res) => {
  currentSubscription = req.body;
  res.status(201).json({ message: "登録完了" });
});

app.get("/test", (req, res) => {
  if (!currentSubscription) {
    return res.status(404).send("登録されていません");
  }
  const payload = JSON.stringify({
    title: "ぐるぐる通知",
    message: "そろそろはみがきの時間だよ〜"
  });
  webpush.sendNotification(currentSubscription, payload).catch(console.error);
  res.send("通知送信しました！");
});

app.listen(10000, () => {
  console.log("ぐるぐる通知サーバーが起動しました http://localhost:10000");
});