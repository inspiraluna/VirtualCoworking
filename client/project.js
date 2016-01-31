  Template.project.helpers({
     projectIsActive: function(id, activeId) {
        return (id === activeId) ? "active" : "";
     }
  });
