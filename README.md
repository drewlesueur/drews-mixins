Drew's Mixins
=============

### doThese

The `doThese` mixin is for calling a bunch of asyncronous funcitons
and being notified when they are *all* done.
This should be used when you need to be notified when a group of async functions have completed.
(Like when you have to know when to send an http response.)
Here is a contrived example of why you would want this.
You'll have to assume that a bunch of variables exist like `PhotoAPI` and `db` for this example.

    todos =
      photos: (err, done) ->
        PhotoAPI.getPhoto "drew", (photoError, photos) ->
          if photoError then return err photoError
          done photos
      videos: (err, done) ->
        VideoAPI.getVideo "myacctnumber", (videoError, videos) ->
          if videoError then return err videoError
          done videos
      profile: (err, done) ->
        db.connect "mydb", (connectionError, connection) ->
          if connectionError then return err connectionError
          connection.query "SELECT * FROM PROFILE WHERE ID = ?", ['drew'], (dbError, results) ->
            if dbError then return err dbError
            done results
      

    _.doThese todos, (errors, values) ->
      #this callback gets executed when they are all done
      if errors then return res.send errors
      res.send
        media: [values.photos, values.videos]
        info: values.profile

Using `doThese` instead of nesting funcitons is optimized because you are able to do more at once.
Here is an example of doing it the wrong way.

    values = {}
    errors = {}
    PhotoAPI.getPhoto "drew", (photoError, photos) ->
      if photoError then errors.photos = photoError
      values.photos = photos
      VideoAPI.getVideo "myacctnumber", (videoError, videos) ->
      if videoError then errors.videos = videoError
        values.videos = videos
        db.connect "mydb", (connectionError, connection) ->
          if connectionError then return errors.profile = connectionError
          connection.query "SELECT * FROM PROFILE WHERE ID = ?", ['drew'], (err, results) ->
            if dbError then errors.profile = dbError
            values.results = results
            res.send restuls
    
Here you get a continuous chain of callbacks that is slower and harder to reason over.

##errorHelper
But hang on, all this error handling is getting too repetative.
A simple error handler function can help.
    
    todos =
      photos: (err, done) ->
        PhotoAPI.getPhoto "drew", _.errorHelper err, (photos) ->
          done photos
      videos: (err, done) ->
        VideoAPI.getVideo "myacctnumber", _.errorHelper err, (videos) ->
          done videos
      profile: (err, done) ->
        # if you leave out the second argument,
        # you get a function that you can pass what would have been the
        # second parameter
        handle = _.errorHelper(err)
        db.connect "mydb", handle (connection) ->
          connection.query "SELECT * FROM PROFILE WHERE ID = ?", ['drew'], handle (results) ->
            done results
      
     errorResponse = (res, error) ->
       res.send error

     _.doThese todos, _.errorHelper errorResponse, (values) ->
       res.send
         media: [values.photos, values.videos]
         info: values.profile


        
