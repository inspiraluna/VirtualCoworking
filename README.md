Todos
-----

- (P1) ring project all online project members http://buzz.jaysalvat.com/documentation/sound/
- (P1) add amazon S3 - for not deleting archives.
- (P1) give archive a name and make it editable
- (P1)  if session is already running - connect subscribe and display without publish own video
- (P1)  User can be owner (have shares), member (have hours, rates) 

- (P1)  add 'done in percent'
- (P2)  share recording (email/twitter/facebook/g+)
- (bug) two windows of the videopartner appear.	
- (P2)  enable/disable audio/video during recording
- (P2)  eventually make projects div an sub projects div a fixed size and scrollable if too long
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
- (p2) schedule webrtc call and video for a certain time (or now) for all members
- referenced projects
- add translations
- redirect non-webrtc browser 
- check drag&drop of layers https://github.com/tomsabin/meteor-sortable-editable-drag-n-droppable-lists
- data version management - https://github.com/thiloplanz/v7files/wiki/Vermongo
- check https://github.com/Slava/meteor-rethinkdb
- check information for blockchain
	https://21.co/
	http://www.multichain.com/blog/2015/11/avoiding-pointless-blockchain-project/
	http://readwrite.com/2016/01/06/new-blockchain-applications
	https://alpha.ujomusic.com/#/imogen_heap/tiny_human/tiny_human (blockchain artist portal)
	http://www.linuxfoundation.org/news-media/announcements/2015/12/linux-foundation-unites-industry-leaders-advance-blockchain (linux foundation for blockchain
	)

Stuffs:
mongo `meteor mongo --url virtualc.meteor.com | sed 's/mongodb:\/\//-u /' | sed 's/:/ -p /' | sed 's/@/ /'`


Done
----
- 2016-01-15 - (P1) display online project members 
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