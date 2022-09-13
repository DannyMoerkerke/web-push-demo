if('serviceWorker' in navigator) {
  const subscribeButton = document.querySelector('#subscribe');
  const unsubscribeButton = document.querySelector('#unsubscribe');
  const titleField = document.querySelector('#title');
  const messageField = document.querySelector('#message');
  const delayField = document.querySelector('#delay');
  const interactionField = document.querySelector('#interaction');
  const sendButton = document.querySelector('#send');

  // const apiUrl = 'https://localhost:3000';
  const apiUrl = 'https://a8x0fuducc.execute-api.us-east-1.amazonaws.com/dev/push';

  subscribeButton.addEventListener('click', async () => {
    const response = await (await fetch(`${apiUrl}/public-key`)).json();
    const publicKey = response.publicKey;

    await subscribeToPushMessages(serviceWorkerRegistration, publicKey);

    subscribeButton.disabled = true;
    unsubscribeButton.disabled = false;
    sendButton.disabled = false;
  });

  unsubscribeButton.addEventListener('click', async () => {
    const pushSubscription = await getPushSubscription();

    try {
      const success = await unsubscribeFromPushMessages(pushSubscription);

      if(success) {
        console.log('successfully unsubscribed');

        subscribeButton.disabled = false;
        unsubscribeButton.disabled = true;
        sendButton.disabled = true;
      }
      else {
        console.log('unsubscribing was not successful');
      }
    }
    catch(err) {
      console.log('error unsubscribing', err);
    }
  });

  let serviceWorkerRegistration;

  const registerServiceWorker = async () => {
    serviceWorkerRegistration = await navigator.serviceWorker.register('./service-worker.js');

    const pushSubscription = await getPushSubscription();

    if(pushSubscription) {
      subscribeButton.disabled = true;
      unsubscribeButton.disabled = false;
      sendButton.disabled = false;
    }
    else {
      subscribeButton.disabled = false;
      unsubscribeButton.disabled = true;
      sendButton.disabled = true;
    }
  };

  const getPushSubscription = () => serviceWorkerRegistration.pushManager.getSubscription();

  registerServiceWorker();

  const base64UrlToUint8Array = base64UrlData => {
    const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
    const base64 = (base64UrlData + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

    const rawData = atob(base64);
    const buffer = new Uint8Array(rawData.length);

    for(let i = 0; i < rawData.length; ++i) {
      buffer[i] = rawData.charCodeAt(i);
    }

    return buffer;
  };

  const subscribeToPushMessages = (registration, publicKey) => registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlToUint8Array(publicKey)
  });

  const unsubscribeFromPushMessages = subscription => subscription.unsubscribe();

  const sendPushMessage = async ({title, message, delay, interaction}) => {
    const pushSubscription = await getPushSubscription();

    fetch(`${apiUrl}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pushSubscription,
        title,
        message,
        delay: delay * 1000,
        interaction
      })
    });
  };

  sendButton.addEventListener('click', () => {
    const title = titleField.value;
    const message = messageField.value;
    const delay = delayField.value !== '' ? delayField.value : 0;
    const interaction = interactionField.checked;

    sendPushMessage({title, message, delay, interaction});
  });
}
