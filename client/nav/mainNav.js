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
