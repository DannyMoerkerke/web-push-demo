const version = 18;

const notificationClickHandler = (e) => {
  const {action} = e;
  // const url = 'web+coffee://americano';
  const url = 'https://whatpwacando.today';

  console.log('clicked notification, action: ', action);

  e.waitUntil(self.clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then((clientList) => {
    if (url) {
      const client = clientList.find(({url}) => url);

      console.log(clientList);
      if (client) {
        client.focus();
        e.notification.close();
        return client.navigate(url);
      }

      e.notification.close();
      // if client doesn't have navigate function, try to open a new browser window
      return self.clients.openWindow(url);

    }
  }));
};

const notificationCloseHandler = (e) => {
  const dismissedNotification = e.notification;

  console.log('notification closed', dismissedNotification);
};

const pushHandler = async e => {
  const data = e.data.json();
  const {title, message, interaction} = data;

  const options = {
    body: message,
    icon: '/src/img/icons/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now()
    },
    actions: [
      {
        action: 'confirm',
        title: 'OK'
      },
      {
        action: 'close',
        title: 'Close notification'
      },
    ],
    requireInteraction: interaction
  };

  try {
    await self.registration.showNotification(title, options)
  }
  catch(err) {
    console.log(err);
  }
};

const fetchHandler = async e => {
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true})
    .then(response => response || fetch(e.request))
  )
};

self.addEventListener('fetch', fetchHandler);
self.addEventListener('push', pushHandler);
self.addEventListener('notificationclose', notificationCloseHandler);
self.addEventListener('notificationclick', notificationClickHandler);
