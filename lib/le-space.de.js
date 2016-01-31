Projects = new Mongo.Collection("projects");
ProjectUsers = new Mongo.Collection("projectusers");

Router.configure({
  layoutTemplate: 'mainNav'
});

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
          return [
          Meteor.subscribe('documentSnapshotObject', this.params.slug), 
          Meteor.subscribe('projects'),
          Meteor.subscribe('userData')];
    },
    data: function(){

      if (this.ready()){
          // var user = Meteor.users.findOne({ emails : { $elemMatch : { address:'nico@le-space.de' }}});
          var project = Projects.findOne({slug:this.params.slug}); 
          if(project){
            Session.set('project',project);  
            document.title = Session.get('project').projectname + ' by ' + Meteor.users.findOne(Session.get('project').createdBy).profile.name;
          }
          return project;
      }
    },
    seo: {
      title: function() {
        if(this.data())
          return this.data().projectname + ' by ' + Meteor.users.findOne(this.data().createdBy).profile.name;
        else
          return null;
      },
      description: function() {
        if(DocumentSnapshotObject.findOne('mySearch'))
          return DocumentSnapshotObject.findOne('mySearch').results;  //' this should be a meta tag for project'+this.data().projectname;
        else
          return '';
      },
      og: {
            // type: 'movie',
            // url: 'https://virtualc.meteor.com/socialarguments',
            // site_name: 'Virtual Coworking by Le Space',
            // // image: 'http://www.le-space.de/les_button_klein.png',
            // 'video:height': '260', 
            // 'video:width': '420',
            // 'video:type':'video/mp4',
            'video' : function() {
                    
                    var archives = this.data().archives;
                    if(archives && archives.length>0){
                      console.log(JSON.stringify(archives));  
                      console.log(archives[archives.length-1].url);
                      return archives[archives.length-1].url;
                    }
                   // else
                     // return 'https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4';
             },

            type: 'movie',
            url: 'https://virtualc.meteor.com/socialarguments',
            site_name: 'Virtual Coworking by Le Space',
            //image: 'http://www.le-space.de/les_button_klein.png',
            'video:height': '260', 
            'video:width': '420',
            'video:type':'video/mp4',
    // video: 'https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4',
    
    // 'video:type':'text/html',
    // video: 'https://virtualc.meteor.com/jwplayer/jwplayer.flash.swf?file=https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4&autostart=false',
    // 'video:secure_url' : 'https://virtualc.meteor.com/jwplayer/jwplayer.flash.swf?file=https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4&autostart=false'
  

           // 'https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4',
    
              // site_name: function() {
              // return this.data().projectname + ' by ' + Meteor.users.findOne(this.data().createdBy).profile.name;
              // },
              // description: function(){
              // return Session.get('documentSnapshot');  //' this should be a meta tag for project'+this.data().projectname;
              // },
        }
    },
    action: function () {

        //manage the online user list for the project
        var project = Projects.findOne({slug:this.params.slug}); 
        // Session.set('projectId', project._id);
        projectuser = {
            user            : Meteor.userId(),
            project         : project._id, 
            away            : false
        };

        if(!ProjectUsers.findOne({user:  Meteor.userId()})){
          var projectUserId = ProjectUsers.insert(projectuser);
        }

        Session.set('projectUserId', projectUserId);
        Meteor.subscribe('projectUsers', project._id);
       
        Session.set('project',project);

        // Meteor.call('getArchive', Session.get('project')._id, function (error, result) {
        //            Session.set('archiveData',result);
        // });
        this.render();
    },
    unload : function() {
        // Remove the user from the list of users.
        var projectUserId = Session.get('projectUserId');
        ProjectUsers.remove({ _id : projectUserId });
        Session.set('project', null);
    }
});

Projects.helpers({

  onlineUsers: function(){
      var onlineUsers = ProjectUsers.find({project: this._id});
      return onlineUsers;
  },
  creator: function() {
    return Meteor.users.findOne(this.createdBy);
  },
  childs: function(){
      return Projects.find({parent: this._id});
  },
  parentSlug: function(){
    if(this.parent){
      var project = Projects.findOne(this.parent); 
      return project.slug;
    }
    else 
      return '';
  },
  // archiveData: function(){
  //     return Session.get('archiveData');
  // }

});

