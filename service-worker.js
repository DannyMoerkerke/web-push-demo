const version = 7;

const notificationClickHandler = (e) => {
  const {action} = e;
  const url = 'web+coffee://americano';

  console.log('clicked notification, action: ', action);

  e.waitUntil(self.clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then(function (clientList) {
    if (url) {
      let client = null;

      for (let i = 0; i < clientList.length; i++) {
        let item = clientList[i];

        if (item.url) {
          client = item;
          break;
        }
      }

      if (client && 'navigate' in client) {
        client.focus();
        e.notification.close();
        return client.navigate(url);
      }
      else {
        e.notification.close();
        // if client doesn't have navigate function, try to open a new browser window
        return clients.openWindow(url);
      }
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

self.addEventListener('push', pushHandler);
self.addEventListener('notificationclose', notificationCloseHandler);
self.addEventListener('notificationclick', notificationClickHandler);
