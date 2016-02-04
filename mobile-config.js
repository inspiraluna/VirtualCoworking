// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.lespace.virtualc',
  name: 'Virtual Coworking',
  description: 'Video Conference your projects',
  author: 'Nico Krause',
  email: 'nico@le-space.de',
  website: 'http://www.le-space.de'
});

// Set up resources such as icons and launch screens.
// App.icons({
//   'iphone': 'icons/icon-60.png',
//   'iphone_2x': 'icons/icon-60@2x.png',
//   // ... more screen sizes and platforms ...
// });

// App.launchScreens({
//   'iphone': 'splash/Default~iphone.png',
//   'iphone_2x': 'splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1022486891149330',
  API_KEY: '896abc3c0d204392d8eecf2dc1a9095b'
});