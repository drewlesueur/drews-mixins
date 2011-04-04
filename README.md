==Drew's Mixins==

### doThese

The `doThese` mixin is for calling a bunch of asyncronous funcitons
and being notified when they are *all* done.
This should be used when you need to be notified when a group of async functions have completed.
(Like when you have to know when to send an http response.)
Here is a contrived example of why you would want this.
You'll have to assume that a bunch of variables exist like 'PhotoAPI' and 'db' for this example.

    todos =
      photos: (done) ->
        PhotoAPI.getPhoto "drew", (err, photos) ->
          done photos
      videos: (done) ->
        VideoAPI.getVideo "myacctnumber", (err, videos) ->
          done videos
      profile: (done) ->
        db.connect "mydb", (err, connection) ->
          connection.query "SELECT * FROM PROFILE WHERE ID = ?", ['drew'], (err, results) ->
            done results

    _.doThese todos, (values) ->
      #this callback gets exacuted when they are all done
      req.send
        media: [values.photos, values.videos]
        info: values.profile

Using `doThese` instead of nesting funcitons is optimized because you are able to do more at once.
Here is an example of doing it the wrong way.

    values = {}
    PhotoAPI.getPhoto "drew", (err, photos) ->
      values.photos = photos
      VideoAPI.getVideo "myacctnumber", (err, videos) ->
        values.videos = videos
        db.connect "mydb", (err, connection) ->
          connection.query "SELECT * FROM PROFILE WHERE ID = ?", ['drew'], (err, results) ->
            values.results = results
            res.send restuls
    
Here you get a continuous chain of callbacks that is slower and harder to reason over 





        
