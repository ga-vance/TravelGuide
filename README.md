# Database Management Systems Project
### Submission by: Greg Vance, Ethan Sengsavang

## Starting the Servers
Within the project repository, a docker-compose file is provided. To start the
docker containers, a `.env` file must be created within the project folder.

This `.env` file must contain the following environment variables:
- `MY_SQL_ROOT_PASSWORD`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `JWT_SECRET_KEY`
- `MYSQL_HOST`, which must be equal to `cpsc471_database`

An example `.env` file is as follows:
```
MYSQL_ROOT_PASSWORD=thesupersecretrootpassword
MYSQL_USER=idosql
MYSQL_PASSWORD=bananasareyellow?
MYSQL_DATABASE=flightbooking
JWT_SECRET_KEY=iamasupersecretjsonwebtokenkey:D
MYSQL_HOST=cpsc471_database
```

After creating this `.env` file, the project may be hosted using
`docker-compose`. This is done by running the following command within the
project root folder.
```
docker-compose up --build -d
```

(Note: `--build` will build the containers within the project, `-d` detaches the
 docker logs.)

Once started, an HTTP web server is set up in container `cpsc471_webserver` at
port 8000. A MySQL (MariaDB) database container will be initialized in
`cpsc471_database`. The API server waits for the database server to be initialized
before starting on port 3000 within container `cpsc471_apiserver`. Setup typically
takes about 15 seconds.

It should be noted that the database is exposed externally when running the
server via docker. To expose this, the `docker-compose.yml` file may be updated
by adding the following under `database:`.

```yml=
    ports:
      - "3306:3306"
```
This will expose the database onto port `3306` of the device. If this port is in
use, `docker-compose` will fail. To use a different port, `<desired port>:3306`
should be used.

To access the database without exposing the database port, the `cpsc471_database`
containers may be signed into.
```
docker exec --user root -it cpsc471_database /bin/sh
```
Once within the container, the mysql terminal client may be started.

```
/app # mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 11
Server version: 10.1.19-MariaDB MariaDB Server

Copyright (c) 2000, 2016, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> _
```

To take down the server, `docker-compose down` may be run within the project
path. This will destroy and remove the containers created.

## Token Generation
This website uses JavaScript WebTokens (JWT) to establish user states. As such,
some API endpoints require the JWT to function. The website will generate its own
tokens as necessary, however, a token may be generated for testing purposes. This
can be done by making an API call to `/users/genToken` as specified below.

Using cURL:
```
curl -X POST localhost:3000/users/genToken \
     --data '{"user":"gvance", "pass":"password"}' \
     --header "content-type: application/json"
```
This example cURL request generates a token for user `gvance`, however the
username and password for any account may be used, including admin accounts.

*note:* During testing, there was difficulty with configuring Postman to use
these tokens. Automated testing via Postman will require any API calls using
JWT to be modifed.

The API calls to modify are:
- `GET /users/:userID`
- `DELETE /users/:userID`
- `PUT /users/:userID`
- `POST /frequentFlier`
- `GET /frequentFlier:customerID`
- `GET /reservation/:userID`
- `PUT /admin/:adminID`

Modification is done by commenting lines similar to:
```js
  const {tokenId} = validateToken(request);
  if (tokenId != request.params.adminID) {
    response.sendStatus(403);
    return;
  }
```

Otherwise, authorization tokens are passed within a request by an `Authorization`
header.

An example request using cURL would be as followed:
```
curl -X DELETE \
     --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiZ3ZhbmNlIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY1MDEzNTYzMX0.7Mvye0YXky_-2Kiug79fx6SZiYkbkUjEDnKIc1gwdbA
     localhost:3000/users/1
```
This deletes the user `gvance` from the database.

### Pre-generated tokens
A valid token, using the JWT secret key of iamasupersecretjsonwebtokenkey:D for
different types of users are as followed:

__User - gvance__
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiZ3ZhbmNlIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY1MDEzNTYzMX0.7Mvye0YXky_-2Kiug79fx6SZiYkbkUjEDnKIc1gwdbA
```

__Admin - gvanceAdmin__
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiZ3ZhbmNlQWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NTAxMzU4Njl9.TGpUUa7NEnI0evjHndQ67gmkj4prByY_QJp1svE6cNE
```

## Languages and Dependencies Used
This project uses the following technologies:

__languages__
- NodeJS v16.14.2, NPM v8.5.0
- HTML, JavaScript, CSS

__technologies__
- Docker-compose, Docker
- Javascript WebTokens
- Express
- MySQL, MariaDB
