# meanstack
Personal Hobby Project built with MEAN stack
Developed on MacOS

This project uses mongodb as a database. There is json for a collection of artists. This json should be imported to database named meanMusic. 

# use this command to import given json
mongoimport --db meanMusic --collection artists --jsonArray artists.json

# use this command if database to be imported is bson/zip
mongorestore --gzip dump/      //inside dump there should be foler named with database and bson/zip file inside

# use this command to export bson/zip
mongodump --db  meanMusic --gzip

# use this command to export json collection
mongoexport --dd meanMusic --collection artists --out artists.json --jsonArray --pretty