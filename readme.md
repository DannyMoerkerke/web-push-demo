# Web Push Demo
This demo consists of an HTML page where you can send a push 
message that results in a notification and a Node.js script that 
takes care of the push subscription and sending the push messages.

This demo works in Chrome, Firefox, Edge, and Safari Tech Preview on
MacOS Ventura.

Note that for MacOS Ventura you will need to install the public 
beta version.

## Running the demo
This demo requires both the frontend and backend to run as HTTPS 
so you will need a SSL certificate.

Make sure you have `openssl` installed.

To generate a self-signed certificate, run the following command:

```
npm run generate-cert
```
This will generate a self-signed certificate and place all the 
needed files in the `ssl` folder.

After that you will need to make your device trust the certificate.

On MacOS you do this by opening the Keychain Access app and then 
click `System` under `System Keychains` in the menu on the left.

Click the `Certificates` tab in the top menu and then drag the 
file `localhost-cert.pem` in the `ssl` folder onto the Keychain 
Access app.

Then double-click the certificate you just added, find the `Trust` 
section and click the arrow to open it.

In the select box labeled "When using this certificate", select 
"Always trust".

For Windows, refer to [this link](https://aboutssl.org/installing-self-signed-ca-certificate-in-window/).

To get the demo running in Firefox you will first need to visit 
`about:config` and then search for the `security.enterprise_roots.enabled` 
option.

Click the toggle icon on its row to set the value to `true`.

Run `npm install` once, then `npm start` and then visit 
[https://localhost:9500](https://localhost:9500) to see the 
demo page.

Follow the instructions on the page to send a push message and 
get a notification.

You can set a delay for the message to be sent, so you can close 
the browser and wait for the notification to be displayed even 
when the browser is not running.

This works in Chrome on ChromeOS, Safari Tech Preview on 
MacOS Ventura and Chrome on Android.

## How it works
The demo works by sending the push subscription along with the 
message data to the push server. The push server then knows 
where the message should be sent.

In a real-life situation, the push subscription will be saved in 
a database from where all subscriptions will then be retrieved 
that need to receive a push message.

The actual push messages are sent with the [web-push](https://github.com/web-push-libs/web-push) 
library. Please see the README for more information.





