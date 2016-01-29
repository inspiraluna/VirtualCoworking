if (window.location.protocol != "https:" &&  window.location.href.indexOf('localhost')==-1)
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);

$(document).ready(function(){ $.cookieBar(); });

var defaults = {
  title: '',                 // Will apply to <title>, Twitter and OpenGraph.
  suffix: 'Virtual Coworking',
  separator: ',',

  description: 'Transparent project communications',        // Will apply to meta, Twitter and OpenGraph.
  image: 'http://www.le-space.de/les_button_klein.png',   // Will apply to Twitter and OpenGraph.

  meta: {
    keywords: ['coworking', 'crowd', 'videoconference', 'video', 'conference', 'funding']
  },

  twitter: {
    card: 'summary',
    creator: '@handle'
    // etc.
  },

  og: {
    site_name: 'Virtual Coworking',
    image: '/images/virtualcoworking.png'
    // etc.
  }
};

var options = {
  defaults: defaults
};
Router.plugin('seo', options);

  Template.mainNav.helpers({
    siblings: function(){
        if(Session.get('project')){
          return Projects.find({parent: this.parent}); 
        }
        else {
          return Projects.find({parent: null});
        } 
    }
  });

  Template.home.onCreated(function () {
    this.subscribe("projects");
    this.subscribe("userData");
  });

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

         Meteor.call("documentSnapshot", this._id, function (error, result) {  
            Session.set('documentSnapshot', result);
         }); 
        
         return Session.get('documentSnapshot');
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
  
  Template.project.helpers({
     projectIsActive: function(id, activeId) {
        return (id === activeId) ? "active" : "";
     }
  });

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
    }
  });

  Template.recording.helpers({
    niceTime: function() { 
      return moment(new Date(this.createdAt)).fromNow();
      //return moment(new Date(this.createdAt)).format('l LT');
    },
    isOwner : function(){
       var p = Projects.findOne({'archives.id': this.id});
       return (Meteor.userId() === p.createdBy);
    }
  });

  Template.recording.events({
    "click .delete": function () {
      Meteor.call('deleteArchive',this.id, function (error, result) {
           console.log(error,result);
      });
    }
  });

  function hasParentClass( e, classname ) {
    if(e === document) return false;
    if( classie.has( e, classname ) ) {
      return true;
    }
    return e.parentNode && hasParentClass( e.parentNode, classname );
  }

  function resetMenu(container) {
        classie.remove( container, 'st-menu-open' );
  }

  // http://coveroverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

Template.mainNav.rendered = function(){

  var container = document.getElementById( 'st-container' ),
      buttons = Array.prototype.slice.call( document.querySelectorAll( '#st-trigger-effects > i' ) ),
      // event type (if mobile use touch events)
      eventtype = mobilecheck() ? 'touchstart' : 'click',
      bodyClickFn = function(evt) {
        if( !hasParentClass( evt.target, 'st-menu' ) ) {
          resetMenu(container);
          document.removeEventListener( eventtype, bodyClickFn );
        }
      };
      
    buttons.forEach( function( el, i ) {
        // alert('bla');
      var effect = el.getAttribute( 'data-effect' );

      el.addEventListener( eventtype, function( ev ) {
        ev.stopPropagation();
        ev.preventDefault();
        container.className = 'st-container'; // clear
        classie.add( container, effect );
        setTimeout( function() {
          classie.add( container, 'st-menu-open' );
        }, 25 );
        document.addEventListener( eventtype, bodyClickFn );
      });
    } );

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