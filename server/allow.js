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
      //return _contains(fields,'likes');
      return _.contains(fields,'likes') || Owner(userId,docs.createdBy) || isAdmin(userId);
    },
    remove: function (userId, docs){
      return isOwner(userId,docs.createdBy) || isAdmin(userId);
    }
  });

