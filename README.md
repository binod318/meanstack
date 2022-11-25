# meanstack
Personal Hobby Project built with MEAN stack
Developed on MacOS

This project uses mongodb as a database. There is json for a collection of artists. This json should be imported to database named meanMusic. 

dbname: 
-meanMusic

collections:
-artists
-users

# use this command to import given json
mongoimport --db meanMusic --collection artists --jsonArray artists.json

# use this command if database to be imported is bson/zip
mongorestore --gzip dump/      //inside dump there should be foler named with database and bson/zip file inside

# use this command to export bson/zip
mongodump --db  meanMusic --gzip

# use this command to export json collection
mongoexport --dd meanMusic --collection artists --out artists.json --jsonArray --pretty

======================================================

This package has two independent projects.
1. express application (service)
2. angular application (UI)

nodemon package must be installed globally to run this package.

Node modules must be installed separately from these two lcoations. 
1. root level
2. /public/angular-app/

Use npm start from root level to run two projects together.
UI is running on port 4200 and service is running on 3000