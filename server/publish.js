  Meteor.publish('userData', function () { 
      return Meteor.users.find({}, {fields: {_id: 1, //'emails.address': 1, 
        profile: 1, 
        'services.twitter.profile_image_url_https' : 1,
        'services.google.picture': 1,
        'services.github.username': 1,
        'services.facebook.id' : 1}} );
  }); 

  Meteor.publish('documentSnapshotObject',function(slug){

    var self = this;
    if(slug) {
      var project = Projects.findOne({slug:slug});
      if(project){
        Meteor.call('documentSnapshot', project._id, function(error, snapshot){
          if (snapshot){
            self.added("documentSnapshotObject", "mySearch", {results: snapshot});
            self.ready();
          } else {
            self.ready();
          }
        });
      }
    }
      else self.ready();
  });

  Meteor.publish('projects', function(slug){

    if(slug) return Projects.find({slug: slug});

    if(this.userId)
      return Projects.find({$or: [ { createdBy: this.userId}, {likes: this.userId}]});
    else this.ready();
  }); 
    
  Meteor.publish('projectUsers', function(projectId) {
      var id = this._session.userId;
      this._session.socket.on("close", Meteor.bindEnvironment(function(){
          ProjectUsers.remove({user:  id});
      }, function(e){console.log(e)}));

    return ProjectUsers.find({ project : projectId });
  });