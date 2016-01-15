Projects = new Mongo.Collection("projects");
ProjectUsers = new Mongo.Collection("projectusers");


Projects.friendlySlugs( {
    slugFrom: 'projectname',
    slugField: 'slug',
    distinct: true,
    updateSlug: false
  });

Router.route('/', {
    template: 'home',
    waitOn: function(){
      return [Meteor.subscribe('projects'),Meteor.subscribe('userData')];
    },
    data: function(){
      var project = null; //Projects.find({},{sort: {createdAt: 1}}).fetch()[0];
      Session.set('project',null);
      
      return project;
    }
});

Router.route('/:slug', {
    name: 'projects',
    template: 'home',
    waitOn: function(){
          // return Meteor.subscribe('projects');
           return [Meteor.subscribe('projects'),Meteor.subscribe('userData')];
    },
    data: function(){

        if ( this.ready() ){
          console.log('slug:'+this.params.slug);
          var project = Projects.findOne({slug:this.params.slug}); 
          Session.set('project',project);
          console.log('project'+project._id);
          console.log(project?project.projectname:'no slug!'+this.params.slug);
          

        
        return project;
      }
    },
    action: function () {

        //manage the online user list for the project
        var project = Projects.findOne({slug:this.params.slug}); 
        Session.set('projectId', project._id);
        projectuser = {
            user            : Meteor.userId(),
            project         : project._id, 
            away            : false
        };

        if(!ProjectUsers.findOne({user:  Meteor.userId()}))
        {
          var projectUserId = ProjectUsers.insert(projectuser);
        }
        Session.set('projectUserId', projectUserId);
        Meteor.subscribe('projectUsers', project._id);
       
        Session.set('project',project);

        Meteor.call('getArchive', Session.get('project')._id, function (error, result) {
                   Session.set('archiveData',result);
        });
        

       this.render();
    }, 
    unload : function() {
        // Remove the user from the list of users.
 
        var projectUserId = Session.get('projectUserId');
        console.log('now removing...'+projectUserId);
        ProjectUsers.remove({ _id : projectUserId });
        Session.set('project', null);
    }
});

Projects.helpers({

  onlineUsers: function(){
      return ProjectUsers.find();
  },
  projectUserCount: function(){
      return ProjectUsers.find().count();
  },
  creator: function() {
    console.log(Meteor.users.findOne(this.createdBy));
    return Meteor.users.findOne(this.createdBy);
  },
  childs: function(){
      // console.log('finding children: of '+this._id+' : '+Projects.find({parent: this._id}).count());
      return Projects.find({parent: this._id});
  },
  parentSlug: function(){
    // console.log('looking for parent...'+this.parent+' :'+Projects.find().count());
    if(this.parent){
      var project = Projects.findOne(this.parent); 
      // console.log('okey found parent slug:'+project.slug);
      return project.slug;
    }
    else 
      return '';
  },
  archiveData: function(){
      return Session.get('archiveData');
  }

});

if (Meteor.isClient) {

if (window.location.protocol != "https:" &&  window.location.href.indexOf('localhost')==-1)
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);

  Template.recording.helpers({
    niceTime: function() { 
      return moment(new Date(this.createdAt)).fromNow();
      //return moment(new Date(this.createdAt)).format('l LT');
    }
  });

  Template.recording.events({
    "click .delete": function () {
      Meteor.call('deleteArchive',this.id, function (error, result) {
           console.log(error,result);
      });
    }
  });

  Template.home.onCreated(function () {
    this.subscribe("projects");
    this.subscribe("userData");
  });

  Template.home.helpers({

     siblings: function(){
      if(Session.get('project')){
        return Projects.find({parent: this.parent}); 
      }
      else {
        return Projects.find({parent: null});
      } 
     },
     
     sessionId: function() {
        return  Session.get('sessionId');
     },
     
     archiveStarted: function() {
        return  Session.get('archiveStarted');
     },

     projectIsActive: function(id) {
        return (this.id === id) ? "active" : "";
     }
  });

  Template.project.helpers({
     projectIsActive: function(id, activeId) {
        return (id === activeId) ? "active" : "";
     }

  });

  Template.home.events({
    "click .delete": function () {
      Projects.remove(this._id);
    }
  });

Template.home.rendered = function(){
   var self = this;
   if(Meteor.userId()){
    $('#projectname.editable').editable({
      placement: "auto top",
      success: function(response, newValue) {
            Projects.update(self.data._id,{$set:{projectname: newValue}});
        }
      });
    $('#description.editable').editable({
      placement: "auto top",
      success: function(response, newValue) {
              Projects.update(self.data._id,{$set:{description: newValue}});
      }
    });
  }
}

var session = null;

  Template.home.events({
         
         "click #new-video": function (event) {
         event.preventDefault();  
         var sessionId = null;

         if(Session.get('project') && Session.get('project').sessionId)
          sessionId = Session.get('project').sessionId;

          Meteor.call("startVideo", sessionId, function (error, result) {
            
            var sessionId = result;
            Session.set('sessionId', sessionId);

            Meteor.call("token", sessionId, function (error, result) {
            var token = result;
            var apiKey = "45454102";
            session = OT.initSession(apiKey,sessionId);
            session.on("streamCreated", function(event){
                session.subscribe(event.stream, "layoutContainer", {
                    insertMode: "append"
                });
                layout();
            }).connect(token, function (err) {
                if (!err) {
                    Projects.update(Session.get('project')._id,{$set:{sessionId: sessionId}});
                    session.publish("publisherContainer");
                   // layout();
                }
            });
          });
         });         
        },
        "click #stop-video": function (event) {
         event.preventDefault();

         var sessionId = null;

         if(Session.get('project') && Session.get('project').sessionId)
          sessionId = Session.get('project').sessionId;
         
          Meteor.call("stopVideo", sessionId, function (error, result) {  
          session.disconnect();
          Session.set('sessionId', null);
         });         
        },
        "click #start-archive": function (event) {
         event.preventDefault();
          Meteor.call("startArchive",  Session.get('project')._id, Session.get('sessionId'), function (error, result) {  
          console.log('archive:'+result.id);
          Session.set('archiveStarted', result.id);
         });         
        },
       "click #stop-archive": function (event) {
         event.preventDefault();
          Meteor.call("stopArchive", Session.get('archiveStarted'), function (error, result) {  
          Session.set('archiveStarted', null);
         });         
        },
        "submit .new-project": function (event) {
         event.preventDefault();

          var projectname = event.target.projectname.value;
          var parent = null;
          if(event.target.parent && event.target.parent.value!='')
            parent = event.target.parent.value
            
            Projects.insert({
              projectname: projectname,
              parent: parent,
              createdBy: Meteor.userId(),
              createdAt: new Date()
            });

          event.target.projectname.value =  '';
        }
  });

}

if (Meteor.isServer) {

  Meteor.publish('userData', function () { 
    return Meteor.users.find({}, {fields: {_id: 1, 'emails.address': 1, 
      profile: 1, 
      'services.twitter.profile_image_url_https' : 1,
      'services.google.picture': 1,
      'services.github.username': 1,
      'services.facebook.id' : 1}} );
  }); 

  Meteor.publish('projects', function(slug){
      return Projects.find();
  }); 
  
  Meteor.publish('projectUsers', function(projectId) {
      var id = this._session.userId;
      this._session.socket.on("close", Meteor.bindEnvironment(function()
      {
       //ProjectUsers.update({project: projectId},{$set:{away: true}});
       ProjectUsers.remove({user:  id});
      // console.log('user left project:'+id); // called once the user disconnects
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
      return (userId && ownerId && userId === ownerId);
  }

  function isAdmin(userId) {  
    var adminUser = Meteor.users.findOne({ emails : { $elemMatch : { address:'nico@le-space.de' }}});
      return (userId && adminUser && userId === adminUser._id);
  }


  ProjectUsers.allow({
    insert: function(userId, doc){
      return Meteor.userId()?true:false;  //adminUser(userId);
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
      return Meteor.userId()?true:false;  //adminUser(userId);
    },
    update: function(userId, docs, fields, modifier){
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    },
    remove: function (userId, docs){
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    }
  });

    var apiKey = '45454102';  
    var apiSecret = 'fd2911e46c0a1c02d7f0664222169195c7eb146f';
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

    Meteor.startup(function () {

      Meteor.methods({

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
        getArchive: function(archiveId){
            console.log('retrieving archive '+archiveId);
            var archives = Projects.findOne(archiveId).archives;
            if(!archives) return null;

            var data  = [];
            for(var i = 0;i<archives.length;i++){
                  var archive = callGetArchiveAsyncWrap(archives[i].id).content;
                  data.push(JSON.parse(archive));
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
}
