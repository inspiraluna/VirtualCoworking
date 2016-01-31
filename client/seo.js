var defaults = {
  title: 'Le Space',                 // Will apply to <title>, Twitter and OpenGraph.
  suffix: 'Virtual Coworking',
  separator: '|',
  // fb: { 
  //       app_id : '1022486891149330'
  //     },
  description: 'Transparent project communications',        // Will apply to meta, Twitter and OpenGraph.
  image: 'http://www.le-space.de/les_button_klein.png',   // Will apply to Twitter and OpenGraph.

  meta: {
    keywords: ['coworking', 'crowd', 'videoconference', 'video', 'conference', 'funding']
  },

  // twitter: {
  //   card: 'summary',
  //   creator: '@inspiraluna',
  //   description: 'who'
  // },

  og: {
    type: 'movie',
    url: 'https://virtualc.meteor.com/socialarguments',
    site_name: 'Virtual Coworking by Le Space',
    //image: 'http://www.le-space.de/les_button_klein.png',
    'video:height': '260', 
    'video:width': '420',
    'video:type':'video/mp4',
    video: 'https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4',
    
    //'video:type':'text/html',
    //video: 'https://virtualc.meteor.com/jwplayer/jwplayer.flash.swf?file=https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4&autostart=false',
    //'video:secure_url' : 'https://virtualc.meteor.com/jwplayer/jwplayer.flash.swf?file=https://s3-eu-west-1.amazonaws.com/virtualc/45454102/f41cf04b-cebe-4577-93c6-8a08f2a96537/archive.mp4&autostart=false'
  }
};

var options = {
  defaults: defaults
};

Router.plugin('seo', options);