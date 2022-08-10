const version = 7;

const notificationClickHandler = (e) => {
  const {action} = e;

  console.log('clicked notification, action: ', action);
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
