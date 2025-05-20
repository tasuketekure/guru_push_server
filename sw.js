
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || '通知';
  const options = {
    body: data.body || '通知が届きました。',
    icon: 'stamp.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
