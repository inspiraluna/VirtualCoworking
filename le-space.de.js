Projects = new Mongo.Collection("projects");

Projects.friendlySlugs( {
    slugFrom: 'projectname',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
  });

Router.route('/', {
    template: 'home',
    waitOn: function(){
      var thisId = Session.get("project")?Session.get("project")._id:null;
      return Meteor.subscribe('projects',thisId);
    }
});

Router.route('/:slug', {
    name: 'projects',
    template: 'home',
    waitOn: function(){
          return Meteor.subscribe('projects',this.params.slug);
    },
    data: function(){
      // if(this.params.slug && this.params.slug!='_'){
      //  Meteor.call("getProject", this.params.slug, function (error, result) {
      //   console.log('project:'+result._id);
      //     Session.set('project',result);
      //    // return result;
      //  });
      //  }
       var project = Projects.findOne({slug:this.params.slug}); 
       console.log(project?project.projectname:'no slug!'+this.params.slug);
       Session.set('project',project);
       return project;
    }
});

if (Meteor.isClient) {

  Template.home.helpers({

     sessionId: function() {
        return  Session.get('sessionId');
     },
     archiveStarted: function() {
        return  Session.get('archiveStarted');
     },
     projectIsActive: function(id) {
        console.log('thisId:'+this.id+' '+_id);
        return (this.id === id) ? "active" : ""
     },
     projects: function () {
        var count = 0;
        var query = Projects.find({},{sort: {projectname: 1}});
        return query;
     },
     // project: function () {
     //    return Session.get('project');
     // }
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
    // "mouseover .project": function () {
    //   var project = Projects.findOne({_id: this._id});
    //   console.log('found project:'+project.projectname);
    //   Session.set('selectedProject', project);
    // }

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
        
        // var self = this;
         
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
            console.log('session:'+sessionId);
            console.log('token:'+token);

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
          Meteor.call("startArchive", Session.get('sessionId'), function (error, result) {  
          Session.set('archiveStarted', true);
         });         
        },
       "click #stop-archive": function (event) {
         event.preventDefault();
          Meteor.call("stopArchive", Session.get('sessionId'), function (error, result) {  
          Session.set('archiveStarted', false);
         });         
        },
        "submit .new-project": function (event) {

         event.preventDefault();
         // console.log('new project'+event.target.parent.value);
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

  Meteor.publish('projects', function(slug){

      var parent = null;
      var projects = null;

      if(slug && slug!='_'){
         console.log('slug:'+slug);
         parent = Projects.findOne({slug:slug})._id;
         console.log('okey parent is:'+parent.projectname);
      }

      //{$or: [{parent: parent},
      projects = Projects.find({parent: parent}); 
      console.log('found projects...'+Projects.find({parent: parent}).count());
     
      return projects;
  });
 

  function isOwner(userId, ownerId){  
      return (userId && ownerId && userId === ownerId);
  }

  function isAdmin(userId) {  
    var adminUser = Meteor.users.findOne({ emails : { $elemMatch : { address:'nico@le-space.de' }}});
      return (userId && adminUser && userId === adminUser._id);
  }

  Projects.allow({
    insert: function(userId, doc){
      return Meteor.userId()?true:false;  //adminUser(userId);
    },
    update: function(userId, docs, fields, modifier){
      console.log('docs.createdBy'+docs.createdBy);
      console.log('userId:'+userId);
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    },
    remove: function (userId, docs){
      console.log('userId:'+userId);
      console.log('docs.createdBy'+docs.createdBy);
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    }
  });

  Meteor.startup(function () {

      var openTokClient = new OpenTokClient('45454102', 'fd2911e46c0a1c02d7f0664222169195c7eb146f');
    
      Meteor.methods({

        // getProject: function(slug){

        //         if(slug!=null){
        //           console.log('try finding the project with slug:'+slug);
        //           var project = Projects.findOne({slug:slug}); 
        //           console.log(' found project'+project._id);
        //           return project;
        //         }
        //         else return null;
        //          // var project = Projects.findOne({slug:this.params.slug}); 
        //          // console.log(project?project.projectname:'no slug!'+this.params.slug);
        //          // Session.set('project',project);
        //          // return project;

        // },
        startArchive: function(sessionId){
          var options = {
              name: 'My archive name' //This is the name of the archive. You can use this name to identify the archive.
          };
          openTokClient.startArchive(sessionId, options);
          return null;
        },

        stopArchive: function(sessionId){
            var archive = openTokClient.stopArchive(sessionId);
            return archive;
        },

        startVideo: function(sessionId){ 
          console.log('sessionId from client:'+sessionId);
          var options = {
                mediaMode: 'routed', //Options are 'routed' (through openTok servers) and 'relayed' (Peer to Peer)
                location: '192.168.0.101' //An IP address that the OpenTok servers will use to situate the session in the global OpenTok network.
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
        
           console.log('got sessionId from opentok:'+session);
           return null;
        },  
      });

  });
}
