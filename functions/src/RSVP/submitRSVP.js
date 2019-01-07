const { validate } = require('validate.js');
const { db, functions } = require('../utils/firestore');
const { constraints } = require('./constraints');

exports.submitRSVP = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', 'Content-Type, crossDomain');

  const { id, applicantType } = JSON.parse(request.body);
  let collection = '';

  if (applicantType === 'volunteer') {
    collection = 'volunteer_short_info';
  } else if (applicantType === 'hacker') {
    collection = 'hacker_short_info';
  }

  const {
    emergencyContactName,
    emergencyContactNumber,
    tShirtSize,
    dietRestriction,
    wouldLikeToSee,
  } = JSON.parse(request.body).data;

  const rsvpData = {
    rsvp: {
      emergencyContactName,
      emergencyContactNumber,
      tShirtSize,
      dietRestriction,
      wouldLikeToSee,
    },
    tags: {
      going: true,
    },
  };

  const errors = validate(rsvpData.rsvp, constraints.rsvp);
  if (errors) {
    response.status(400).send('Data validation failed');
  }

  const userRef = db.collection(collection).doc(id);
  userRef.set(rsvpData, { merge: true })
    .then(value => response.send(value))
    .catch(error => error);
});
