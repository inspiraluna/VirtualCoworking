var apiKey = '45454102';  
var apiSecret = 'fd2911e46c0a1c02d7f0664222169195c7eb146f';

 var openTokClient = new OpenTokClient(apiKey, apiSecret);

    var callStartArchiveAsync = function(_id, sessionId, callback){

        var name='archive of some project';
        var data= {"sessionId" : sessionId, "name" : name};
        var headers = {
                          'Content-Type' : 'application/json',
                          'X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret
        };

        HTTP.call( 'POST', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive', {
                data: data,
                headers: headers
        }, function( error, response ) {

                  var origArchive = response.data;
                  var project = Projects.findOne(_id);
                  var archives = [];

                  if(project.archives)
                    archives = project.archives;

                  var archive = { 
                    id: origArchive.id,
                    name: project.projectname+' '+(archives.length+1),
                    duration: origArchive.duration,
                    createdAt: origArchive.createdAt,
                    url: 'https://s3-eu-west-1.amazonaws.com/virtualc/'+apiKey+'/'+origArchive.id+'/archive.mp4'
                  };


                  archives.push(archive);
                  Projects.update(_id,{$set:{archives: archives}}); 
                  
                  callback(error,response.data);
          });
    };  

    var callStartArchiveAsyncWrap = Meteor.wrapAsync(callStartArchiveAsync);

    // var callGetArchiveAsync = function(archiveId, callback){
    //   console.log('calling archive:'+archiveId);
    //   var headers = {
    //                     'Content-Type' : 'application/json',
    //                     'X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret
    //   };

    //   HTTP.call( 'GET', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive/'+archiveId, {headers: headers}, 
    //     function( error, response ) { 



    //           callback(error,response); 
    //     });
    // };

    // var callGetArchiveAsyncWrap = Meteor.wrapAsync(callGetArchiveAsync);

    var callDeleteArchiveAsync = function(archiveId, callback){

    var projectWithArchive = Projects.findOne({ archives : { $elemMatch : { id:archiveId}}});
    if(projectWithArchive.archives){
      for(var i = 0;i<projectWithArchive.archives.length;i++){
        if(projectWithArchive.archives[i].id===archiveId){
            projectWithArchive.archives.splice(i, 1);
            Projects.update(projectWithArchive._id,{$set:{archives: projectWithArchive.archives}});
        }

      }
    }

    var headers = {'Content-Type' : 'application/json','X-TB-PARTNER-AUTH' : apiKey+':'+apiSecret };
      HTTP.call( 'DELETE', 'https://api.opentok.com/v2/partner/'+apiKey+'/archive/'+archiveId, {headers: headers}, 
        function( error, response ) { callback(error,response); });
    };
    
    var callDeleteArchiveAsyncWrap = Meteor.wrapAsync(callDeleteArchiveAsync);

    var getSnapshotSync = Meteor.wrapAsync(ShareJS.model.getSnapshot);
    

    Meteor.startup(function () {
      console.log('starting up...');
      Meteor.methods({
        documentSnapshot : function(_id){
            try {
                var result = getSnapshotSync(_id);
                return result.snapshot;

              }
              catch(err) {
                      return '';
              }
        },
        startArchive: function(_id, sessionId){
          return callStartArchiveAsyncWrap(_id, sessionId);       
        },
        stopArchive: function(sessionId){
            var archive = openTokClient.stopArchive(sessionId);
            console.log('stopped archive....'+archive);
            return archive;
        },
        deleteArchive: function(_id,archiveId){
           return callDeleteArchiveAsyncWrap(_id,archiveId); 
        },
        // getArchive: function(id){
        //     console.log('looking for archive of:'+id);
        //     var p = Projects.findOne(id);
            
        //     if(!p || !p.archives) return null;

        //     // console.log('found project:'+JSON.stringify(p));
        //     var data  = [];
        //     for(var i = 0;i<p.archives.length;i++){
        //       try {
        //           var origArchive = JSON.parse(callGetArchiveAsyncWrap(p.archives[i].id).content);

        //           var archive = { 
        //             id: origArchive.id,
        //             name: p.projectname+' '+i,
        //             duration: origArchive.duration,
        //             createdAt: origArchive.createdAt,
        //             url: 'https://s3-eu-west-1.amazonaws.com/virtualc/'+apiKey+'/'+p.archives[i].id+'/archive.mp4'
        //           };


        //           data.push(archive);  
        //         }catch(error){console.log('error while getting archive information from opentok - offline?');}
        //         // https://s3-eu-west-1.amazonaws.com/virtualc/45454102/8f2cb962-42c5-4711-a3ed-8e3562dfa7f6/archive.mp4
        //     }
        //     return data;
        // },
        startVideo: function(sessionId){ 

          // Create a session and store it in the express app

          console.log('sessionId from client:'+sessionId);
          var options = {
                mediaMode: 'routed', //Options are 'routed' (through openTok servers) and 'relayed' (Peer to Peer)
                location: '5.9.154.226' //An IP address that the OpenTok servers will use to situate the session in the global OpenTok network.
          };

          var session = sessionId;

          if(!sessionId){
            session = openTokClient.createSession(options);
            console.log('created new opentok sessionId:'+session);
           }  
          return session;
        },

        token: function (sessionId) {
              console.log('token called with sessionId:'+sessionId);
              // var sessionId = 'some-session-id';
              var options = {
                  role: 'publisher', //The role for the token. Each role defines a set of permissions granted to the token
                  data: "userId:42",
                  expireTime: Math.round(new Date().getTime() / 1000) + 86400 // (24 hours) The expiration time for the token, in seconds since the UNIX epoch. The maximum expiration time is 30 days after the creation time. The default expiration time of 24 hours after the token creation time.
              };

              var token = openTokClient.generateToken(sessionId, options);  
              console.log('generated token:'+token);
              return token
        },

        stopVideo: function(sessionId){ //(session)
        
           // console.log('got sessionId from opentok:'+session);
           return null;
        },  
      });

  });
