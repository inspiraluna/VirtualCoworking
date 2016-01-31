
Accounts.onCreateUser(function(options, user) {

    if (user.profile == undefined) { //standard account creation add email as profile
        user.profile = {name: options.email}; 
    }
       return user;
}); 


   