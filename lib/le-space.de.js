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
          var project = Projects.findOne({slug:this.params.slug}); 
          Session.set('project',project);  
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

        if(!CProjectUsers.findOne({user:  Meteor.userId()}))
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
        ProjectUsers.remove({ _id : projectUserId });
        Session.set('project', null);
    }
});

Projects.helpers({

  onlineUsers: function(){
      var onlineUsers = ProjectUsers.find();



      return onlineUsers;
  },
  // projectUserCount: function(){

  //     return ProjectUsers.find().count();
  // },
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

