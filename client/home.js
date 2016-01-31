Template.home.onCreated(function () {
    this.subscribe("projects");
    this.subscribe("userData");
});
DocumentSnapshotObject = new Mongo.Collection('documentSnapshotObject');

Template.home.helpers({
    config: function(){
      return function(cm) {
        cm.setOption("theme", "default");
        cm.setOption("lineNumbers", true);
        cm.setOption("lineWrapping", true);
        cm.setOption("smartIndent", true);
        cm.setOption("indentWithTabs", true);
    }},
    isOwner : function(){
     return (Meteor.userId() === this.createdBy) || (Meteor.userId() && this.createdBy ==null);
    },
    documentSnapshot: function() {
        if(DocumentSnapshotObject.findOne('mySearch'))
          return DocumentSnapshotObject.findOne('mySearch').results; 
        else return '';
    }, 
    projectUserCount: function(){
      var onlineUsers = ProjectUsers.find().count();
      var oldCount = Session.get('onlineUsers');
      if(oldCount===1 && onlineUsers===2){
          var ringSound = new buzz.sound("/sounds/truck",{formats: ["ogg", "mp3"]});
          ringSound.play();
      }
      Session.set('onlineUsers', onlineUsers);

      return ProjectUsers.find().count();
    },
    projectCanBeDeleted : function(){
      return Template.home.__helpers.get('isOwner').call() && Projects.find({parent: this._id}).count()==0;
    },
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
    "click .directoryUp": function () {
        var parent = Projects.findOne(this.parent);
        if(parent) Router.go('/'+parent.slug);
        else Router.go('/');
    },
    "click .delete": function () {
        var parent = Projects.findOne(this.parent);
        Projects.remove(this._id, function(error){
                if(parent) Router.go('/'+parent.slug);
                else Router.go('/');
        });
    },     
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
        }, function(error, _id){
            //jump into project
            var slug = Projects.findOne(_id).slug;
            if(!parent) Router.go('/'+slug);
      });

      event.target.projectname.value =  '';

    }
});
  
