# Sparta
Digital sport shop

Follow the steps in order to run the application:

- Create a .env file and write there your jwtPrivateKey and your DB connection string
- Run at first the seed.js file to initiate the data base with some products.
- On postman, make a post request to the users api in order to create an admin. be aware that before the call, you must cancel the condition of 
authentication & authorization [userAuth, admin] on the users route (in the post method).
The schema of the user should be:
{
  "firstName": "your first name",
  "lastName":"your last name",
  "id": your Id,
  "email": "your mail",
  "userName": "your userName",
  "password": "your password"
  isAdmin: true
}

Once you add yourself to the user database as an admin, you can add any other user or product (don't forget to put back the authentication & authorization!)
