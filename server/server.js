var apiKey = '45454102';  
var apiSecret = 'fd2911e46c0a1c02d7f0664222169195c7eb146f';

  Meteor.publish('userData', function () { 
      return Meteor.users.find({}, {fields: {_id: 1, //'emails.address': 1, 
        profile: 1, 
        'services.twitter.profile_image_url_https' : 1,
        'services.google.picture': 1,
        'services.github.username': 1,
        'services.facebook.id' : 1}} );
  }); 

  Meteor.publish('projects', function(slug){
     // return Projects.find({createdBy: this._session.userId});
      return Projects.find();
  }); 
    
  Meteor.publish('projectUsers', function(projectId) {
      var id = this._session.userId;
      this._session.socket.on("close", Meteor.bindEnvironment(function(){
          ProjectUsers.remove({user:  id});
      }, function(e){console.log(e)}));

    return ProjectUsers.find({ project : projectId });
  });

  Accounts.onCreateUser(function(options, user) {

    if (user.profile == undefined) { //standard account creation add email as profile
        user.profile = {name: options.email}; 
    }
       return user;
  }); 

  function isOwner(userId, ownerId){  
      return (userId === ownerId);
  }

  function isAdmin(userId) {  
    var adminUser = Meteor.users.findOne({ emails : { $elemMatch : { address:'nico@le-space.de' }}});
      return (userId && adminUser && userId === adminUser._id);
  }


  ProjectUsers.allow({
    insert: function(userId, doc){
      var exists = ProjectUsers.findOne({project: doc.project, user: userId})
      console.log('project already exists... what a bug!');
      return !exists; //true; //Meteor.userId()?true:false;  //adminUser(userId);
    },
    update: function(userId, docs, fields, modifier){
      return isOwner(userId,docs.user) || isAdmin(userId);
    },
    remove: function (userId, docs){
      return isOwner(userId,docs.user) || isAdmin(userId);
    }
  });

  Projects.allow({
    insert: function(userId, doc){
      if(!doc && userId) return true;
      return isOwner(userId,doc.createdBy) || isAdmin(userId);
      // var parentProject = Projects.findOne(doc.parent)
      //only add when parent project is null or 
      //remote user is parent project creator is the same 
      // if(!parentProject) return Meteor.userId()?true:false;  //adminUser(userId);
      // else if (parentProject && Meteor.userId() == parentProject.createdBy) return true;
      // else return false;
    },
    update: function(userId, docs, fields, modifier){
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    },
    remove: function (userId, docs){
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    }
  });

    var openTokClient = new OpenTokClient(apiKey, apiSecret);

    var callStartArchiveAsync = function(_id, sessionId, callback){

        var name='archive of some project';
        var data= {"sessionId" : sessionId, "name" : name};
        var headers = {
                          'Content-Type' : 'application/json',
                          'X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret
        };

        HTTP.call( 'POST', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive', {
                data: data,
                headers: headers
        }, function( error, response ) {
                    if ( error ) {
                      console.log( error );
                      callback(error,response);
                    } else {
                          console.log(response.data);
                          var archives = [];
                          if(Projects.findOne(_id).archives)
                            archives = Projects.findOne(_id).archives;

                          archives.push(response.data);
                          Projects.update(_id,{$set:{archives: archives}});
                          // return response.data.id;
                          callback(error,response.data);
                      }
          });
    };  

    var callStartArchiveAsyncWrap = Meteor.wrapAsync(callStartArchiveAsync);

    var callGetArchiveAsync = function(archiveId, callback){
      console.log('calling archive:'+archiveId);
      var headers = {
                        'Content-Type' : 'application/json',
                        'X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret
      };

      HTTP.call( 'GET', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive/'+archiveId, {headers: headers}, 
        function( error, response ) { callback(error,response); });
    };

    var callGetArchiveAsyncWrap = Meteor.wrapAsync(callGetArchiveAsync);

    var callDeleteArchiveAsync = function(archiveId, callback){

    var projectWithArchive = Projects.findOne({ archives : { $elemMatch : { id:archiveId}}});
    if(projectWithArchive.archives){
      for(var i = 0;i<projectWithArchive.archives.length;i++){
        if(projectWithArchive.archives[i].id===archiveId){
            projectWithArchive.archives.splice(i, 1);
            Projects.update(projectWithArchive._id,{$set:{archives: projectWithArchive.archives}});
        }

      }
    }

    var headers = {'Content-Type' : 'application/json','X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret };
      HTTP.call( 'DELETE', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive/'+archiveId, {headers: headers}, 
        function( error, response ) { callback(error,response); });
    };
    
    var callDeleteArchiveAsyncWrap = Meteor.wrapAsync(callDeleteArchiveAsync);

    var getSnapshotSync = Meteor.wrapAsync(ShareJS.model.getSnapshot);
    

    Meteor.startup(function () {
      console.log('starting up...');
      Meteor.methods({
        documentSnapshot : function(_id){
            var result = getSnapshotSync(_id);
            return result.snapshot;
        },
        startArchive: function(_id, sessionId){
          return callStartArchiveAsyncWrap(_id, sessionId);       
        },
        stopArchive: function(sessionId){
            var archive = openTokClient.stopArchive(sessionId);
            console.log('stopped archive....'+archive);
            return archive;
        },
        deleteArchive: function(_id,archiveId){
           return callDeleteArchiveAsyncWrap(_id,archiveId); 
        },
        getArchive: function(id){
            console.log('looking for archive of:'+id);
            var p = Projects.findOne(id);
            
            if(!p || !p.archives) return null;

            // console.log('found project:'+JSON.stringify(p));
            var data  = [];
            for(var i = 0;i<p.archives.length;i++){
                  var origArchive = JSON.parse(callGetArchiveAsyncWrap(p.archives[i].id).content);
                  console.log(JSON.stringify(origArchive));
                  var archive = { 
                    id: origArchive.id,
                    name: p.projectname+' '+i,
                    duration: origArchive.duration,
                    createdAt: origArchive.createdAt,
                    url: 'https://s3-eu-west-1.amazonaws.com/virtualc/'+apiKey+'/'+p.archives[i].id+'/archive.mp4'
                  };

                  console.log(archive);
                  data.push(archive);  // https://s3-eu-west-1.amazonaws.com/virtualc/45454102/8f2cb962-42c5-4711-a3ed-8e3562dfa7f6/archive.mp4
            }
            return data;
        },
        startVideo: function(sessionId){ 

          // Create a session and store it in the express app

          console.log('sessionId from client:'+sessionId);
          var options = {
                mediaMode: 'routed', //Options are 'routed' (through openTok servers) and 'relayed' (Peer to Peer)
                location: '5.9.154.226' //An IP address that the OpenTok servers will use to situate the session in the global OpenTok network.
          };

          var session = sessionId;

          if(!sessionId){
            session = openTokClient.createSession(options);
            console.log('created new opentok sessionId:'+session);
           }  
          return session;
        },

        token: function (sessionId) {
              console.log('token called with sessionId:'+sessionId);
              // var sessionId = 'some-session-id';
              var options = {
                  role: 'publisher', //The role for the token. Each role defines a set of permissions granted to the token
                  data: "userId:42",
                  expireTime: Math.round(new Date().getTime() / 1000) + 86400 // (24 hours) The expiration time for the token, in seconds since the UNIX epoch. The maximum expiration time is 30 days after the creation time. The default expiration time of 24 hours after the token creation time.
              };

              var token = openTokClient.generateToken(sessionId, options);  
              console.log('generated token:'+token);
              return token
        },

        stopVideo: function(sessionId){ //(session)
        
           // console.log('got sessionId from opentok:'+session);
           return null;
        },  
      });

  });
