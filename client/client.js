
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

      projectUserCount: function(){

        var onlineUsers = ProjectUsers.find().count();
        console.log('online users:'+onlineUsers);
        var oldCount = Session.get('onlineUsers');
        console.log('oldCount users:'+oldCount+' onlineUsers:'+onlineUsers);
        if(oldCount===1 && onlineUsers===2){

         var ringSound = new buzz.sound("/sounds/truck",{formats: ["ogg", "mp3"]});
         ringSound.play();
          // mySound2 = new sound("/sounds/mysound2.ogg"),
          // mySound3 = new sound("/sounds/mysound3.ogg");
          // buzz.all().play();
        }

        Session.set('onlineUsers', onlineUsers);

        return ProjectUsers.find().count();
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
  
  Template.home.config = function(){
    return function(cm) {
        cm.setOption("theme", "default");
        cm.setOption("lineNumbers", true);
        cm.setOption("lineWrapping", true);
        cm.setOption("smartIndent", true);
        cm.setOption("indentWithTabs", true);
    }
  }

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