import User from '../models/User';
import axios from 'axios';
import oauth2Client from '../utils/googleAuth';
import { TokenPayload  } from 'google-auth-library';

export class GoogleService {
  constructor() { }

async googleAuth(code : string){
  try{
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
   const user = this.findOrCreateUser(userRes.data);
   return user;
  }catch(err){
     console.log('Error in Google Service ::',err);
  }
}
async findOrCreateUser(payload : TokenPayload) {
    try {
     if (!payload.email) {
           throw new Error('No Email found in Google payload!');
      }
      let user = await User.findOne({email:payload.email});
      if (!user) {
        user = await User.create({
          name: payload.name,
          email: payload.email,
          password: 'google-auth',
          phone: 'NA',
          status: true,
          role: 'User',
        });
      }
      return user;
    } catch (error) {
        console.error('Error finding or creating user:', error);
        throw new Error('Error creating user from Google Data!');
    }
  }
 }


