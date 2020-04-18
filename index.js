var express = require('express');
var app = express();
var fs = require('fs');

// This is the definition of the Person class -- DO NOT CHANGE IT!
/*class Person {
    constructor(id, status, date) {
        this.id = id;
        this.status = status;
        this.date = date;
    }
}

// This is the map of IDs to Person objects -- DO NOT CHANGE IT!
var people = new Map();
people.set('1234', new Person('1234', 'safe', new Date().getTime()));
people.set('5678', new Person('5678', 'missing', new Date().getTime()));
people.set('1111', new Person('1111', 'safe', new Date().getTime()));
people.set('4321', new Person('4321', 'deceased', new Date().getTime()));
people.set('5555', new Person('5555', 'hospitalized', new Date().getTime()));
people.set('3500', new Person('3500', 'safe', new Date().getTime()));

// This is the '/test' endpoint that you can use to check that this works
// Do not change this, as you will want to use it to check the test code in Part 2
app.use('/test', (req, res) => {
    // create a JSON object
    var data = { 'message' : 'It works!' };
    // send it back
    res.json(data);
});

// This is the endpoint you need to implement in Part 1 of this assignment
app.use('/get', (req, res) => {
    var personJson = []
    if (!req || !req.query || !req.query.id) {
        res.json([]);
    } else if (Array.isArray(req.query.id)) {
        var i;
        for (i = 0; i < req.query.id.length; i++) {
            personJson.push(getPerson(req.query.id[i]));
        }
    } else {
        personJson.push(getPerson(req.query.id));
    }
    res.json(personJson);


});

function getPerson(id){
    if (!people.get(id)) {
        var personJson = ({'id': id, 'status': 'unknown', date: new Date().getTime()})
        return personJson;
    } else {
        var person = people.get(id);
        var personJson = ({'id' : id, 'status' : person.status,
           'date' : person.date});
        return personJson;
    }
}

// -------------------------------------------------------------------------
// DO NOT CHANGE ANYTHING BELOW HERE!

// This endpoint allows a caller to add data to the Map of Person objects
// You do not need to do anything with this code; it is only provided
// as an example but will also be used for grading your code
app.use('/set', (req, res) => {
    // read id and status from query parameters
    var id = req.query.id;
    var status = req.query.status;
    // create new Person object
    var person = new Person(id, status, new Date().getTime());
    // add it to Map
    people.set(id, person);
    // send it back to caller
    res.json(person);
});
*/
// This just sends back a message for any URL path not covered above
app.use('/a', (req, res) => {
    res.send('Default message.');
});

// This starts the web server on port 3000.
app.listen(3000, () => {
    console.log('Listening on port 3000');
});

/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://alluser:alluser@350s20-42mongodb-pvpes.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/


var schemas = require('./User.js');
var Person = schemas.userModel;
var PersonVaccine = schemas.personVaccineSchema;
var Hospital = schemas.hosModel;
var ScheduleSlot = schemas.scheduleSlotModel;
var VaccineInfo = schemas.vaccineModel;

app.use('/create', (req, res) => {
var newPerson = new Person ({
 // defined in Person.js
 username: req.query.username,
 password: req.query.password,
});

newPerson.save( (err) => {
         if (err) {
          res.json( { 'status' : err } );
         } else {
          res.json( { 'status' :'success' } );
         }
    });
});

app.use('/all', (req, res) => {
    Person.find( (err, allPeople) => {
        if (err) {
          res.json( { 'status' : err } );
        } else if (allPeople.length == 0) {
           res.json( { 'status' : 'no people' } );
        } else {
           res.json(allPeople );
        }
    });
});

app.use('/hospitals', (req, res) => {
    Hospital.find( (err, allHospitals) => {
      if (err) {
        res.json( { 'status' : err } );
      } else if (allHospitals.length == 0) {
         res.json( { 'status' : 'no hospitals' } );
      } else {
         var hosNames = []
         allHospitals.forEach( (hospital) => {
             hosNames.push(hospital.name);
         });
         res.json(hosNames);
      }
    });
});

app.use('/procedures', (req, res) => {
    var hospital = req.query.hospital;

    ScheduleSlot.find( (err, allSlots) => {
      if (err) {
          res.json( { 'status' : err } );
      } else if (allSlots.length == 0) {
          res.json( { 'status' : 'no openings' } );
      } else {
          var listings = []
          if (hospital) {
              allSlots.forEach( (listing) => {
                  if (listing.hospital == hospital && !listing.patient) {
                      listings.push(listing);
                  }
              });
              res.json(listings);
          } else {
              allSlots.forEach( (listing) => {
                  if (!listing.patient) {
                      listings.push(listing);
                  }
              });
              res.json(listings);
          }
      }
  });
});

app.use('/requestProcedure', (req, res) => {
    console.log("Attempting");
    var username = req.query.username;
    var note = req.query.note;
    var hospital = req.query.hospital;
    var procedure = req.query.procedure;
    Person.findOne( {username: username}, (err, user) => {
        if (err) {
            console.log(err);
            res.end();
        } else if (user) {
            console.log(user);
            console.log("hospital: " + hospital + " procedure: " + procedure);
            console.log(note);
            ScheduleSlot.findOne( {hospital : hospital, vaccine : procedure}, (err, slot) => {
                if (err) {
                    res.json( { 'status' : err } );
                } else if (!slot) {
                    res.json( { 'status' : 'no openings' } );
                } else {
                    // Slot will gain the patient and special notes
                    slot.patient = user;
                    slot.specialNotes = note;
                    slot.save( (err) => {
                        if (err) {
                            res.json({'status' : err});
                        } else {
                            res.json({'status' : "success"});
                        }
                    });
                }
            });
        }
    });
});

app.use('/editInfo', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;
    var fullName = req.query.fullName;
    var blood = req.query.blood;
    var dob = new Date(Date.parse(req.query.dob));
    Person.findOne( {
     username: username,
      password : password }, (err, person) => {
        if (err) {
            res.json( { 'status' : err } );
        }
        else if (!person) {
           res.json( { 'status' : 'no person' } );
       } else {
        person.fullName = fullName;
        person.email = email;
        person.blood = blood;
        person.dob = dob;
        person.save( (err) => {
          if (err) {
              res.json( { 'status' : err } );
          } else {
               res.json( { 'status' : 'success' } );
          }
        });
      }
    });
  });


app.use('/loginPerson', (req, res) => {
    var searchName = req.query.username;
    var searchPassword = req.query.password;
    Person.findOne( { username: searchName, password: searchPassword }, (err, person) => {
        if (err) {
            res.json( { 'status' : err } );
        } else if (!person) {
          res.json( { 'status' : 'no person' } );
        } else {
          res.json( { 'status' : 'success'  ,'person' : person } );
        }
    });
});

app.use('/addImage', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;
    var imgPath = req.query.imgPath;
    Person.findOne( { username: username, password: password }, (err, person) => {
        if (err) {
            res.json( { 'status' : err } );
        } else if (!person) {
            res.json( { 'status' : 'no person' } );
        } else {
            person.img.data = fs.readFileSync(imgPath);
            person.img.contentType = 'image/png';
            person.save( (err) => {
            if (err) {
              res.json( { 'status' : err } );
            } else {
              res.json( { 'status' : 'success' } );
            }
          });
       }
   });
});

app.use('/addVaccine', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;
    var vId = req.query.vId;
    var vDate = new Date(Date.parse(req.query.vDate));
    var hospitalId = req.query.hId;
    var newVaccine = new PersonVaccine ({
        id: vId,
        date: vDate,
        hospitalId: hospitalId,
        verified: false
    });

    Person.findOne( { username: username, password: password }, (err, person) => {
        if (err) {
           res.json( { 'status' : err } );
        } else if (!person) {
           res.json( { 'status' : 'no person' } );
        } else {
           person.vaccines.push(newVaccine);
           person.save( (err) => {
             if (err) {
               res.json( { 'status' : err } );
             } else {
               res.json( { 'status' : 'success' } );
             }
         });
       }
   });
});

app.use('/addVaccineInfo', (req, res) => {
var newVaccine = new VaccineInfo ({
 // defined in Person.js
 id: req.query.id,
 name: req.query.name,
 info: req.query.info
});

newVaccine.save( (err) => {
         if (err) {
          res.json( { 'status' : err } );
         } else {
          res.json( { 'status' :'success' } );
         }
    });
});

app.use('/allVaccineInfo', (req, res) => {
    VaccineInfo.find( (err, vaccines) => {
        if (err) {
          res.json( { 'status' : err } );
        } else if (vaccines.length == 0) {
           res.json( { 'status' : 'no people' } );
        } else {
           res.json({'status': 'success', 'vaccines' : vaccines} );
        }
    });
});

