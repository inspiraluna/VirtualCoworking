  Template.recording.rendered = function() {

  };

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