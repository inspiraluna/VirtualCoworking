Meteor.startup(function() {
  console.log('Configuring content-security-policy:');
  BrowserPolicy.content.allowSameOriginForAll();
  BrowserPolicy.content.allowOriginForAll('http://meteor.local');
  BrowserPolicy.content.allowOriginForAll('https://virtualc.meteor.com');
  BrowserPolicy.content.allowOriginForAll('https://*.facebook.com');
  BrowserPolicy.content.allowOriginForAll('https://*.google.com');
  BrowserPolicy.content.allowOriginForAll('https://*.twitter.com');
  BrowserPolicy.content.allowOriginForAll('https://*.github.com');
    BrowserPolicy.content.allowOriginForAll('https://*');
    BrowserPolicy.content.allowOriginForAll('*');
  
  BrowserPolicy.content.allowEval();
  //BrowserPolicy.framing.disallow();
});

Accounts.onCreateUser(function(options, user) {

    if (user.profile == undefined) { //standard account creation add email as profile
        user.profile = {name: options.email}; 
    }
       return user;
}); 


   