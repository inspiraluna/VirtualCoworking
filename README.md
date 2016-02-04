#Todos
------

* Priority 1

- ask people to log in first
- make Android App (make it ring when somebody enters a room!)
- mark every idea as (folder, todo (with cost) or cost)
- if session is already running - connect subscribe and display without publish own video
- set private (default public) project not visible for non-members (if private - generate private sharing link)
- (bug) two windows of the videopartner appear sometimes
- (bug) re-enabling the video should not appear below the page instead in the same div where its been before
 
* Priority 2
- every user can be an owner (have shares), member (have hours, rates) 
- save participants in archive
- delete archives from s3 by directly accessing it (project delete from server)
- implement permissions by clicking on user display permission window.
	- edit text in collaborative editor
	- start conference
	- delete & rename archive 
	- change project name

- accounts guests https://github.com/artwells/meteor-accounts-guest
- check prerender for seo https://prerender.io/ 
- upload a project imagine or logo
- redirect non-webrtc browser 
- video größer during conference / fullscreen
- editor großer / fullscreen (including video)
- screen sharing
- own page for each recording (e.g. in order to share an archive link)
- (Maintenance) re-attach old recorded videos to current project.
- update duration of archive when archive stopped.
- share recording (email/twitter/facebook/g+)
- give archive a name and make it editable
- add 'done in percent' for tasks
- enable/disable audio/video during recording

* Priority 3
- add translations
- notifications https://github.com/ttsvetko/HTML5-Desktop-Notifications#usage
- add rss https://github.com/raix/Meteor-rssfeed
- check drag&drop (moving) of projects https://github.com/tomsabin/meteor-sortable-editable-drag-n-droppable-lists
- eventually make projects div an sub projects div a fixed size and scrollable if too long
- apply for project by team member (add planed hours, add planed costs, )
- invite project member (by email)
- add checkbox looking for crowd (let people make offer / budget / offer share / ask for donation / ask for sponsoring)
- add checkbox looking for founding (crowdfunded/investment)
- add priority 
- add order of task (up/down by orderid or alphabetically)
- add location & map  
- add map and display locations
- add planed hours
- add planed costs
- add planed finance model (e.g. )
- schedule webrtc call and video for a certain time (or now) for all members
- referenced projects (link other projects to own project)
- upload videos to facebook https://developers.facebook.com/docs/graph-api/video-uploads

#Technology
- check howto meld accounts into one account https://atmospherejs.com/splendido/accounts-meld
- check video transcoding https://lostechies.com/bradcarleton/2013/11/20/html5-video-transcoding-with-node-js-and-aws/
- check data version management - https://github.com/thiloplanz/v7files/wiki/Vermongo
- check https://github.com/Slava/meteor-rethinkdb
- check information for blockchain
	https://21.co/
	http://www.multichain.com/blog/2015/11/avoiding-pointless-blockchain-project/
	http://readwrite.com/2016/01/06/new-blockchain-applications
	https://alpha.ujomusic.com/#/imogen_heap/tiny_human/tiny_human (blockchain artist portal)
	http://www.linuxfoundation.org/news-media/announcements/2015/12/linux-foundation-unites-industry-leaders-advance-blockchain (linux foundation for blockchain
	)

#"Small-Things":
- delete ShareJS document when project is deleted 
- delete archives document from s3 when project is deleted 
- delete all orphaned shareJS documents 
- delete all orphaned archives from s3
- (ananda) codemirror config https://codemirror.net/doc/manual.html#addons
- (ananda) avatar fallback icon (e.g. virtualc logo) https://github.com/meteor-utilities/avatar
- (ananda) logos & texts for app authentication in facebook, google, github, twitter

#Stuffs:
mongo `meteor mongo --url virtualc.meteor.com | sed 's/mongodb:\/\//-u /' | sed 's/:/ -p /' | sed 's/@/ /'`


#Done
-----
- 2016-02-04 - people who know the slug can see the project
- 2016-02-04 - only signed in people can see their own projects or liked projects
- 2016-02-02 - people have to like a project so owner can give permissions.
			 - add heart to project make it clickable 
			 - save userIds under likes under project 
			 - display people who like the project below project in a table
- 2016-02-01 - while deleting project also remove document from shareJS.
- 2016-01-31 - remove flash video player and re-enable standard HTML5 Player.
- 2016-01-31 - use markdown to display written text https://atmospherejs.com/meteor/markdown
- 2016-01-31 - S3 Autopublish opentok by addig permissions within amazon s3 aws
- 2016-01-30 - snapshot of meteor.call editortext and video.url into publish/subscription 
				http://stackoverflow.com/questions/29923423/meteor-iron-router-waiton-without-subscribe
				http://stackoverflow.com/questions/31238275/how-to-publish-multiple-collections-in-single-subscription-call-in-meteor
- 2016-01-29 - SEO with Meteor 
				https://atmospherejs.com/lookback/seo
				OpenGraph http://ogp.me/ (OpenGraph)
				Meteor & Seo http://www.manuel-schoebel.com/blog/meteor-and-seo
				Facebook OG Debug https://developers.facebook.com/tools/debug/og/object/
				HTML5 Fallback & Flash https://blog.kaltura.org/facebook-now-require-html5-and-fallback-in-open-graph/
				JWPlayer & Facebook http://www.jwplayer.com/blog/publish-your-videos-to-facebook-with-a-jw-player/
				Twitter Cards https://dev.twitter.com/cards/markup
- Change title according to project name 
- Add meta data to post (use text from editor)
- 2016-01-28 - (Enhancement) in one project jump one level up (folder up)
- 2016-01-28 - (Evaluation) Spacebars https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md
- 2016-01-28 - (P1-Bug) if project has children don't allow to delete
- 2016-01-28 - (Enhancement) after project/task delete jump one level up
- 2016-01-28 - (Enhancement) change label of project insert box to task/structure input
- 2016-01-28 - (Enhancement) after new project in root jump into project (not inside a project)
- 2016-01-28 - (Bug) Archive duration is 0 must be set from opentok api
- 2016-01-27 - (Bug) Archiv does not display anymore after S3 link-In.	
					https://tokbox.com/developer/guides/archiving/using-s3.html
- 2016-01-27 (Bug) Archive cannot get deleted after isOwner implementation
- 2016-01-27 add amazon S3 - for not deleting archives.
- 2016-01-20 make it more beautiful (!)
				- http://designmodo.com/linecons-free/
				- https://atmospherejs.com/jelena
- 2016-01-23  
				- closed account
				- insert only allowed in root or where i am owner (done)
- 2016-01-22 	- make it more beautiful 
			 	- permissions
- 2016-01-16 - ring other project member when user count becomes more then 1 http://buzz.jaysalvat.com/documentation/sound/
- 2016-01-16 - (Bug) Don't show first project if no project selected
- 2016-01-16 - use CodeMirror http://codemirror.net/
- 2016-01-16 - (Bug) if not connected with registered user - access denied error during user registration
- 2016-01-15 - display online project members 
- 2016-01-14 - (bug) add profile to normal user from email
- 2016-01-14 - (bug) collaboration text doesn't work sometimes - shows loading - problem with user/owner? 
- 2016-01-14 - (bug) login with https (over facebook, google, twitter, github etc.)	
- 2016-01-14 - (p1) get photo from twitter, facebook, github etc. https://github.com/meteor-utilities/avatar
- 2016-01-14 - (bug) connect to remote mongo
- 2016-01-13 - P1)  Facebook-Anmeldung (Twitter, Google+, github)
			- https://apps.twitter.com
			- https://github.com/settings/applications/new
			- https://developers.facebook.com/apps/1022486891149330/dashboard/
			- https://console.developers.google.com/home/dashboard?project=inspiraluna
- 2016-01-13 -  worked on offline data with: 
					https://github.com/awwx/meteor-offline-data
			 		https://subvisual.co/blog/posts/45-offline-web-apps-with-meteor
			 		https://github.com/GroundMeteor/db
- 2016-01-13 - move recordings into trash https://tokbox.com/developer/guides/archiving/
- 2016-01-13 - move tasks & sub projects below projects div
- 2016-01-13 - bug reload website over slug url does not work - subscription not ready 
- 2016-01-12 - display archives and display video 
- 2016-01-11 - stop archive 
- 2016-01-11 - dealing with async methods and wrapAsync() 
											http://stackoverflow.com/questions/31282493/dealing-with-meteor-error-and-wrapasync-best-methods
											http://www.smashingthingstogether.com/the-javascript-runtime-fibers-and-meteor-wrapasync/
- 2016-01-10 - start archive via rest
- 2016-01-09 - delete project 
- 2016-01-09 - integrate https://github.com/mizzao/meteor-sharejs
- 2016-01-07 - (bug) display all tasks of this project by slug (all projects which have this slug as parent)
	   		 - (bug) display all tasks without parent
- 2016-01-01 start archive 
- 2016-01-01 restart video with same session if available.
- 2016-01-01 associate webrtc session with project
- 2015-12-31 add slug url for each project (project name)
- 2015-12-31 parent project (add childs to project)
- 2015-12-29 add webrtc call 
- 2015-12-29 editable description
- 2015-12-29 editable projectname