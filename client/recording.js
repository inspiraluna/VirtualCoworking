  JWPlayer.load('jkvoLLad'); //mSxNaBn7k22lG3Php/uaBgYRvp56GS0axmTSEA== 

  Template.recording.rendered = function() {
    var self = this; 
    console.log(this);
    this.autorun(function() {
      if (JWPlayer.loaded()) {
        jwplayer('playa').setup({
          file: self.data.url, //'https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4',
          width: '100%',
          aspectratio: '16:9',
          autostart: false
        });
      }
    });
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