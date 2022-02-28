const https = require('https');
const fetch = require('node-fetch')

const header = require("./header.json");

// 1 - Amatör Denizci Online Eğitimi
// 2 - Kısa Mesafe Telsiz (KMT) Online Eğitimi
const educationId = 1; 
const token = "<Your Token From Website>";

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // Disable SSL verification

const delay = w => new Promise(r => setTimeout(r, w)); // Delay/Sleep utility

let _sections = [];

// Start completing courses, use delay 2000 if ECONNECTION occurs
const complete = async () => {
  for (let i = 0; i < _sections.length; i++) {
    await fetch('https://adbs.uab.gov.tr/api/educations/complete', {
      method: "POST",
      headers: {
        ...header,
        authorization: `Bearer ${token}`
      },
      agent: httpsAgent,
      body: JSON.stringify({
        educationId,
        lectureId: _sections[i].lecture,
        complete: true
      })
    }).then(data => data.json()).then(() => console.log(`(${i+1}/${_sections.length}) ${_sections[i].name} ✅`));
    await delay(1000);
  }
}

// Fetch the courses
fetch(`https://adbs.uab.gov.tr/api/educations/${educationId}/sections`, {
    headers: {
      ...header,
      authorization: `Bearer ${token}`
    },
    agent: httpsAgent,
  })
  .then((data) => data.json()).then(sections => {
    sections.forEach(section => section.lectures.forEach(lecture => {
      _sections.push({
        section: section.id,
        lecture: lecture.id,
        name: lecture.name
      })
    }));
    complete();
  })