import { google }  from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ;

const oauth2Client = new google.auth.OAuth2(
     CLIENT_ID,
     CLIENT_SECRET,
     'postmessage',
);

export default oauth2Client;