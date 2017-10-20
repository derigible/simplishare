A simple budgeting app that will expand to take over the world!

# Working with JWT's and postman

Prerequisites:
- ensure you have quiz_api running with all gems and migrations up to date with seed data.
- install the latest postman from the google chrome store

### Getting a new JWT with POST
1. Open postman
2. Set the request type to POST
3. Set the url (field next to POST) to `http://<hostname>/api/account/token`
  *if you're not using docker, it might looks something like
 localhost:<some_port>/api/account/token*
4. Click headers and add a header called `Accept` with the value `application/json`
5. Then, click `Body -> from-data` and enter the following data fields (the following is listed <field> then <value>
    - key: `username` value: `sterling@instructure.com
` *everyone should have their own email @instructure.com added, check *db/seeds/developent/02_user.seeds.rb*
 for a full list of usernames and passwords available.
    - key: `password` value: `password`
    - key: `grant_type` value: `password`
6. Click send and you should get a request back with the token in the body

### Getting JWT information with GET
1. Open postman
2. Set the request type to GET
3. Set the url (field next to GET) to `http://<hostname>/api/account/token/info`
  *if you're not using docker, it might looks something like localhost:<some_port>/api/account/token/info*
4. Click headers and add the following headers
    - key: `Accept` value: `application/json`
    - key: `Authorization` value: `bearer <valid_jwt_generated_from_post>`
5. Click send and you should get back information about your token

### Refreshing a JWT with POST
1. Open postman
2. Set the request type to POST
3. Set the url (field next to POST) to `http://<hostname>/api/account/token`
  *if you're not using docker, it might looks something like localhost:<some_port>/api/account/token*
4. Click headers and add a header called `Accept` with the value `application/json`
5. Then, click `Body -> from-data` and enter the following data fields (the following is listed <field> then <value>
    - key: `username` value: `sterling@instructure.com`
*everyone should have their own email @instructure.com added, check
 *db/seeds/developent/02_user.seeds.rb* for a full list of usernames and passwords available.
    - key: `password` value: `password`
    - key: `grant_type` value: `refresh_token`
    - key: `refresh_token` value: `<refresh token recieved when creating a token with post>`
6. Click send and you should get a request back with the new token in the body

## Debugging

A useful trick for debugging the application within the docker container is to
bypass the Nginx and Passenger service by running Rails directly like so:

```sh
docker-compose run -e VIRTUAL_PORT=8080 -p 8080 --rm api bundle exec rails s -p 8080 -b 0.0.0.0
```

Unlike requests through Passenger, your requests will be processed within the
context of an interactive shell, so `debugger` calls now work. You should also
be able to spin up a [Pry REPL](http://pryrepl.org/) with `binding.pry` calls.
