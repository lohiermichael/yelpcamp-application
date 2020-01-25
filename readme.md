# 1. YelpCamp initial routes

- Add Landing Page
- Add Campgrounds Page that lists all campgrounds

Each Campground has:

- Name
- Image

## Steps

1. npm init
2. Add "start": "node app.js" to launch the application with nodemon
3. npm install express ejs --save
4. Create app.js and set up the server on port 3000
5. Create the landing page
6. Create the campground page
7. Make an anchor tag from the landing page to the campgrounds page
8. Create a sample of 3 campgrounds and display them in the campgrounds page

# 2. YelpCamp Layout

- Create our header and footer partials
- Add in Bootstrap

## Steps

1. mkdir views/partials
2. touch views/partials/header.ejs
3. touch views/partials/footer.ejs
4. Complete these files and include them to the ejs files
5. Include Bootstrap with a CDN link

# 3. Creating new campgrounds

- Setup new campgrounds POST route
- Add in body-parser
- Setup route to show form
- Add basic unstyled form

## Steps

1. Make a post route to campgrounds
2. npm install body-parser --save
3. Render a new page for the form to add a new campground
4. Complete the redirection to the campground page as soon as we add a new object
5. Add an anchor tag to add a new campground on the campground page
6. Add an anchor tag on the campground/new to redirect to the campground page

# 4. Style the campgrounds page

- Add a better header/title
- Make campgrounds display in a grid

## Steps

1. Add a jumbotron and style its elements
2. Put the loop of the campgrounds inside a row, each campground being a col
3. For each campground, create a thumbnail and a caption for the title
4. Adapt the size of each campground with a flex display
5. Center the texts

# 5. Style the Navbar and Form

- Add a navbar to all templates
- Style the new campground form

## Steps

1.  Make the Navbar: brand and collapsed button on the right
2.  Add the nav bar HTML to the header template in the partials folder
3.  Style the form
    - Use grid to center it
    - form-group to space the elements

# 6. Add Mongoose

- Install and configure mongoose
- Setup campground model
- Use campground model inside of our routes

## Steps

1. npm install mongoose --save
2. Import it in the app.js file and make a database yelp_camp
3. Make a model and an instance of campground
4. First try to create a campground in the collection campgrounds in the database yelpcamp
5. Render campgrounds from the database
6. Implement the creation of campground in the database

# 7. Show Page

- Review the RESTFUL routes we've seen so far

We have made 3 RESTFUL routes so far:

1.  `app.get("/campgrounds")`
2.  `app.post("/campgrounds")`
3.  `app.get("/campgrounds/new")`

There are 7 kinds of RESTFUL routes but we are going to cover only 4 of them here:

| name   | ex URL    | verb | desc. of ex                          |
| ------ | --------- | ---- | ------------------------------------ |
| INDEX  | /dogs     | GET  | Display a list of all dogs           |
| NEW    | /dogs/new | GET  | Displays a form to make a new dog    |
| CREATE | /dogs     | POST | Add new dog to database and redirect |
| SHOW   | /dogs/:id | GET  | Displays info about one dog          |

- Add description to our campground model
- show db.collection.drop()
- Add a show route.template

## Steps

1.  Add description on the different routes already created:

- INDEX
- NEW
- CREATE

2. Create the SHOW route of campgrounds as a template
3. Add in description to the model of a campground
4. Drop our previous collection to follow the new pattern with description. You do it when you have a major change in your database structure. The command is `db.campgrounds.drop()`
5. Create a new campground with a description for the example
6. Create a new show.ejs file to display the campground
7. Rename campgrounds.ejs to index.ejs
8. Add a new button to the show page
9. Add a description input in the form

## 8. Refactor Mongoose Code

- Create a models directory
- Use module.exports
- Require everything correctly!

## Steps

1. mkdir models
2. touch models/campground.js
3. Move the content in app.js relative to campground to this file
4. require mongoose in campground.js
5. Export the model out of campground.js
6. Require the Campground model in app.js

# 9. Add a seed file

- Add a seed.js file
- Run the seeds file every time the server starts

## Steps

1. Inside seed.js file, write code to remove all campgrounds from the database
2. Recreate the seeds: 3 campgrounds.
3. Add the same comment for the three campgrounds

# 10. Add the comment model

- Make our errors go away!
- Display comments on campground show page

## Steps

1. touch models/comment.js
2. In this file, make the schema of "comment":
   - author
   - text
3. Refactor the code with async functions
4. Change remove by deleteMany (Node new syntax)
5. Add the comments to the show route by populating the campground with its own comments

# 11. Comment New/Create

- Discuss nested routes

When adding a new comment, we need the campground id to be in the URL. So what we will do is nesting the comment routes on top of the SHOW route of campground

| name   | ex URL                        | verb | desc. of ex                                                        |
| ------ | ----------------------------- | ---- | ------------------------------------------------------------------ |
| NEW    | /campgrounds/:id/comments/new | GET  | Displays a form to make a new comment                              |
| CREATE | /campgrounds/:id/comments     | POST | Add new comment to database link it to its campground and redirect |

- Add the comment new and create routes
- Add the new comment form

## Steps

1. Refactor the structure of our files: create two folders inside of views: comments and campgrounds
2. Make a "new.ejs" file inside the comments folder
3. Change the location of the include for the header and footer
4. Copy the new.ejs file of campground and adapt it for comments. The id of the campground should be kept in the NEW route
5. Make the POST route for comment, if should add the comment to the associated campground
   Add an anchor tag to add a new comment

# 12. Style show page

- Add sidebar to show page
- Display comments nicely

## Steps

1. Put everything on the show page in a container
2. Add in a side bar
3. Use of grid to split the page between the sidebar and the main content
4. Put the main content in a thumbnail
5. Design the comment part
6. For additional styling, add a public directory and a stylesheets and a CSS file in it.

# 13. Auth Pt. 1: Add User Model

- Install all packages for authentication
- Define User model

## Steps

1. npm install passport passport-local passport-local-mongoose express-session --save
2. Import packages in app.js
3. Make the User model

# 14. Auth Pt. 2: Register

- Configure passport
- Add register
- Add register template

## Steps

1. Create an expresss session
2. Initialize it
3. Use the local strategy of the user model
4. Serialize and deserialize
5. Add in the get route for the register
6. Make the view
7. Add in the post route for the register

# 15. Auth Pt. 3: Register

- Add login routes
- Add login template

## Steps

1. Add in the get route for the register
2. Make the view
3. Add in the post route for the register

# 16. Auth Pt. 4: Logout/Navbar

- Add logout route
- Prevent user from adding a comment if not signed in
- Add links to navbar
- Show/hide auth links correctly

## Steps

1. Add in log out route with a get request
2. Redirect to login
3. Add links to respectively login logout and sign in in the header
4. Add header and footer to register and login views
5. Only allows logged-in users to add a comment

# 17. Auth Pt. 5: Show /Hide Links

- Show/hide auth links in navbar correctly

## Steps

1. Add logic in the header partial view
2. Add the currentUser variable that is `undefined` if the user is not logged in as a variable accessible from any view with `app.use` as a middleware
3. Add the name of the current logged in user

_Note:_: It could be a link to a profile page...

# 18. Refactor the routes

- Use Express router to reorganize all routes

## Steps

There are three main groups of routes:

1.  Campgrounds
2.  Comments
3.  Authentication
4.  mkdir routes
5.  touch routes/campgrounds.js
6.  touch routes/comments.js
7.  touch routes/index.js (for authentication)
    _Note:_ we could have created `auth.js` but `index.js` is more common)
8.  Copy paste the code for each part
9.  Change `app` for `router`
10. Manage the dependencies by requiring the adequate package for every route
11. Shorten trick of the code with by prefixing the route of each group of routes. _ex:_ `app.use("/campground)", campgroundRoutes);`

# 19. Users + Comments

- Associate users and comments
- Save author's name to a comment automatically

## Steps

1. Change the schema of the comment: author is no longer a simple string, We keep its id and its username
2. Inside the route, before pushing the comment to the list of comments of the campground, add the username and the id to the comment
3. Remove the **_author_** field from the new comment form
4. Modify the show template of the campground to display only the username in front of the comment

# 20. Users + Campgrounds

- Prevent an unauthenticated user from creating a campground
- Save user+id to a newly created campground

## Steps

1. Use the middleware isLoggedIn on Create and New routes, otherwise, technically someone could make a post request from Postman.
2. Similar to a comments add an author to campground model
3. Add the logic in the root to add the name of the author to each new campground
4. Show the name of the author on the show page

# 21. Editing campgrounds

- Add Method-Override
- Add Edit Route for Campgrounds
- Add Link to Edit Page
- Add Update Route
- Fix \$set problem

## Steps

1. We need to create a PUT request to update a campground and to do that we need method-override
   npm install method-override --save
2. Require method-override in app.js
3. Make a campgrounds/edit.ejs in the views
4. Copy paste the new.ejs form and add in slight modifications: - the redirection
   - the type of request
   - the title of the form
   - the placeholders by the existing values of the campground
5. Add in update route
6. Add a button to edit the campground on the show page

# 22. Deleting campgrounds

- Add DESTROY route
- Add DELETE button

## Steps

1. Make the DESTROY route in the campground.js file
2. Add another button in the show page under a form (to submit the DELETE request it is needed)
3. Restyle the button inside the form with an id

# 23. Authorization

- User can only edit his campgrounds
- User can only delete his campgrounds
- Hide/Show edit and delete button for right user

## Steps

1. To restrict access to the edit functionality only to the user who made the post, we should match the user id and and the creator of the post id. We are not using the middleware this time but rather an internal condition.
2. As soon as it works for the EDIT route. The code can be dried up because it will be used for UPDATE and DELETE routes as well.
3. Modify the SHOW view to only display the edit and delete buttons if the user matches the owner of the post. Hopefully we added to any templates the variable `currentUser` in app.js

**Note:** Even though, we don't display the Edit and Delete buttons for the wrong user, we still keep the middleware to protect the routes for more security.

# 24. Editing comments

- Add Edit route for comments
- Add Edit button
- Add Update route

## Steps

1. Make the EDIT route under the routes/comments.js

**Note:** The routes for comments being nested inside the campground, we need to differentiate the variable names for ids of comment and campground as followed:
campground/:campground_id/comment/:comment_id/edit

2. Add in the Edit button for comment on the campground show page
3. Make the comment edit template by copy pasting the new form and modify it
4. Make the UPDATE route for comments to handle the modification of a comment

# 25. Deleting comments

- Add Destroy route
- Add Delete button

## Steps

1. The route to delete is `/campgrounds/:campground_id/comments/:comment_id`
2. Make the destroy route in the routes/comments.js
3. Make the delete button on the show page of the campground for each comment

# 26. Authorization for comments

- User can only edit his comments
- User can only delete his comments
- Hide/Show edit and delete buttons
- Refactor middleware

## Step

1. Make a checkCommentOwnership middleware: cpy paste the middleware checkCampgroundOwnership and make the slight modifications
2. Add it for the UPDATE and DESTROY routes
3. Display Edit and Delete buttons only for the author of the comment by putting a condition in the show page of the campground
4. mkdir middleware
5. touch middleware/index.js
6. Inside this file make a `middlewareObj` which is a collection in which are put all the middleware functions used for the application and then exports `middlewareObj`
7. Require the middleware inside campground.js and comment.js

**Note:** By default, when you require: `const middleware = require('../middleware');`, it requires the index.js file in the folder.

8. Require Campground and Comment inside middleware/index.js

# 27. Adding in Flash!

- Demo working version
- Install and configure connect-flash
- Add bootstrap alerts to header

## Steps

1. npm install --save connect-flash
2. Require it and use it in app.js
3. Add a req.flash in the middleware for login with error
4. Handle it in /login
5. Add an error message in the login template

**Note:** Debugging, I faced some issues from which I draw lessons:

- Don't use console.log to debug flash as it appears only once i.e in the console.log and not after
- Be careful not to miss up res.render('login') and res.redirect('/login')
- ejs transforms an array with one element inside into a string

6. Add a general variable in app.use:
   `res.locals.message = req.flash('errors')`
7. Move the error message to the header
8. Try another message on logout
9. Change for Bootstrap alerts
10. Put the alert in a container so it doesn't cover all the screen
11. Differentiate error and success flashes
12. Add in conditions to not display the Bootstrap bars if there is no error message
13. Fill in the error messages one at a time by route. For the registration and sign in errors no need to make our own message, we can pass the one of Mongoose

# 28. Refactor landing page

- Create the background slider ejs file
- Style the linked landing.css

## Steps

In the landing.ejs file

1. Make our own header for the landing page with:

   - Bootstrap
   - a personal landing.css stylesheet
   - a link to modernizr which helps make our page cross-browser compatible
   - logic for the errors

2. Make a div with the button to go to campgrounds
3. Make an unordered list with 5 empty items on which will bw attached the 5 sliding background images

In the landing.css file:

4. Change the background
5. Center the text for the header and format the text
6. Implement CSS for the future place of the unordered list. _New:_ z-index to order content
7. Implement CSS with animation for each image:
   - Give to each element of the list a background image
   - Animate the display with an overlap and fade in/out
8. Tackle browser animation support

# 29. Dynamic price feature

- Add a new property Price to the campground object
- Modify the new form
- Modify the edit form
- Modify the show page

## Steps

1. Create anew database **yelp_camp_v12** to avoid any type of overlap
2. Change the model of a campground by adding a price
3. Add an input in the form of campgrounds/new.ejs:
   - Copy the model of the other inputs and adapt the content
   - Add two attributes:
     1. min: stands for the minimum price
     2. step: the value by which is increased the price
4. Add in the input for the form of campgrounds/edit.ejs
5. Display the price in the show page
6. Don't forget to handle the price with the POST route for campground

# 30. Add-ons

- Recursive deletion of comments: when deleting a campground deleting associated comments

- Update campground model:

  1. Require the name
  2. Add a slug field for semantic URL on the name
  3. Before saving the campground in the database add it a slug
  4. Modify the campgrounds routes
  5. Modify middleware
  6. Modify the comments routes
  7. Modify ejs file for the anchor tags and actions of form but not for the conditions

- Implement fuzzy search

  1. Add in a form in the index page of campground
  2. `npm install locus --save`: debugging package
  3. Put the following logic in the index file of campgrounds:
     - If the search input is empty, retrieve all campgrounds
     - Otherwise, only those with the passed input changed with regexp
  4. Handle the no-matching research
  5. Move the form to the landing page as well

- Display time since post was created with Moment JS

  1. Install moment JS: `npm i -S moment`
  2. require moment and add it to app.locals
  3. Update campground and comment models: add an attribute createdAt
  4. Use moment in the show.ejs file

- Improve UI (login, nav-bar, registration)
    1. Use Bootstrap to style the login and sign up views
    2. Update the nav-bar menu
        * Convert .container-fluid to regular .container
        * Add conditional active class to menu list items 
        * Add collapse hamburger menu
        * Make the application responsive

- Display comments on the campground show page directly
- Add flash on not existing user
- Create User admin profile
    1. Add an attribute isAdmin to the User model
    2. Add an input in the register view with a code to enter to be an admin
    3. Add a flash message on sign in if the user is an admin
    4. Add flash message for not correct admin code given
    5. Delete and Edit buttons must appear for admin for campgrounds and comment

- Yelpcamp Like button
    1. Create a new attribute **likes** of campground as a list of users who liked a campground
    2. Make a new route: POST route for adding a new like in the campground.js file
    3. Populate likes on the show route of campground
    4. Use the CDN of jQuery in the header
    5. Change the campground SHOW page
    6. Give the number of likes on the INDEX page of the campgrounds

- Make a user profile
    1. Update the user model with new attributes: first name, last name, email and avatar
    2. Add the corresponding inputs in the register form
    3. Make a route and a view for the user profile
    4. Add address of user profile in anchor tags for the header *Signed In As...* and in the show page of campground *Submitted by...*

- Implement password reset
    1. Install and require async, nodemailer, crypto no need to install it, jst require
    2. Make GET route forgot and EJS file for forgot password with a form to a POST route
    3. Change the email attribute of the model user to be required and unique
    4. Add the two attributes: `resetPasswordExpires` and `resetPasswordToken`
    5. Make the POST route for forgot email:
        * Create a token to send by mail
        * Find the user with the given email in the forgot form
        * Set two attributes to user: `resetPasswordToken` and `resetPasswordExpires` to be respectively the created token and the current time + 1 hour
        * Send an email to the user with the library nodemailer
        * Install dotenv and put the admin password in an environment variable
        * On G-suit, allow less secure app to access Gmail: click [here](https://devanswers.co/allow-less-secure-apps-access-gmail-account/)
    6. The mail is sent to the user with a link to reset the password, make the get route for this reset password with a password and it confirmation
    7. Make a post route for reset password:
        * Find the user in the database by the given token
        * Verify that the expiration date of the token is greater than now
        * Verify that the password and its confirmation match
        * The user is now identified and can be logged in
        * Send an email to confirm that
        * log the user in and redirect him to the campground page
    8. Make a link on the login view to the forgot page


* Rating and reviews
    1. Make a new model review with:
        * a rating between 1 and 5
        * a text associated to comment the review
        * a campground to which the review is linked
        * an author of the review
        * timestamp property set to true so that created and updated times are automatically added
    2. Update campground model by adding to it:
        * a list of reviews
        * a rating which will be the average of all the reviews of the users
    3. make a review routes: routes/reviews.js
        * Require the needed modules
        * Make an INDEX route
        * Make a NEW route
        * Make a CREATE route
        * Make an EDIT route
        * Make an UPDATE route
        * Make a DELETE route
    4. Add middlewares function for review in middleware.index.js:
        * *checkReviewOwnership`:* to check  if the user owns the review 
        * *`checkReviewExistence`:* to check if the user has already written a review
    5.Update the campground routes:
     * SHOW route: populate the reviews
     * DELETE route: remove the the reviews of the campground on deletion
    6. Update app.js to require the index routes
    7. Create new EJS index view for reviews
        * EDIT page
        * INDEX page
        * NEW page
    8. Change campground EJS index view to display the rating
    9. Add a review section in the campground show page handling:
        * The rating of the campground
        * Displaying the 5 latest reviews
        * The edit and delete options for the right user
        * The button to see more reviews

- Upload image with Multer and Cloudinary
    1. Sign up to cloudinary
    2. Install multer and cloudinary: `npm i -S multer cloudinary`
    3. Modify the for campgrounds/new.ejs
    3. Add multer and cloudinary configuration to routes/campgrounds.js
    4. Add the API key and secret as environment variables
    5. Change the create route to add a file instead of a link
    *Note:* Important to not forget the attribute `enctype="multipart/form-data"` to the form is the view
    6. For the edit view:
        * Copy paste in campgrounds/edit.ejs the div of the image input but remove the required attribute as we don't necessarily want to update the image
        * Add the attribute `enctype="multipart/form-data"`
        * In the EDIT route:
            * Add the middleware to upload a file
            * Add a condition to upload if a new image is given
        * Add an attribute id to the image to easily spot it when we want to modify or delete it
        * Change to version v2 of the API of cloudinary
        * Change the UPDATE route
        * Change the DESTROY route

- Migrate to Bootstrap 4
    1. Update the CDN of the stylesheet of bootstrap in the header and of the script in the footer
    2. The navbar has disappeared. Let's update it
    3. On the index page of the campgrounds, change the thumbnails for the new component of Bootstrap
    4. Add a footer and a margin bottom between the campgrounds and th bottom
    5. Refactor login and sign-up pages and the new page for campground by adding labels
    6. On the show page for campground there are multiple glyphicons. This key word of Bootstrap 3 doesn't exist anymore in Bootstrap 4. We use of font size as an alternative
    7. On all the pages reposition the elements using the Bootstrap classes m and p for margin and padding
    8. Change thumbnails and wells for cards

* Add in in-app notification
    1. Make three GET routes:
        * One route to follow for a user to follow another user
        * One route to display all the notifications of an user
        * One route to handle a notification of an user (seen or unseen)
    2. Update the user model:
        * Add a list of notifications
        * Add a list of followers
    3. Create a notification model with the following attributes:
        * `username`: to which the notification will be pushed
        * `campgroundId`: notifications are only for new campgrounds posts. So a notification is linked to a campground
        * `isRead`: stating if the notification has been consulted or not    
    4. In app.js, add the population of the unread notifications for an user when the user is logged in. Save notifications as a local variable
    5. Add an icon for notification to the header that opens a dropdown menu
    6. When we crate a campground, i.e. in th POST route of campground, we have to:
     * Populate the followers of the users who made the campground
     * Create a new notification
    7. Make the view for all the notifications
    8. In the user view add a link to follow

* Pagination on Campground
