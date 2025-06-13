
import { TokenPayload } from '../interface/Interface';
import authRepository from '../repositories/authRepository';
import User from '../models/User';
import axios from 'axios';
import oauth2Client from '../utils/googleAuth';

export class GoogleService {
  constructor() { }

async googleAuth(code : any){
  try{
    console.log('Inside Google service |', code)
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
async findOrCreateUser(payload : any) {
    try {
     if (!payload.email) {
           throw new Error('No Email found in Google payload!');
      }
      let user = await authRepository.isUserExist(payload.email);
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
      console.log('User data :',user);
      return user;
    } catch (error) {
        console.error('Error finding or creating user:', error);
        throw new Error('Error creating user from Google Data!');
    }
  }
 }


