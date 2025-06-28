import mongoose , { Schema , Document, Types } from 'mongoose';

export interface IAgent extends Document{
     userId: Schema.Types.ObjectId;
     address:{
          home:string;
          street:string;
          city:string;
          state:string;
          country:string;
          zipcode:string;
     },
     license: string;
     isVerified:string;
}
const AgentSchema: Schema <IAgent> = new mongoose.Schema({
     userId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref:  'User',
            required: true,
      },
      address: {
        home:{
             type: String,
             required:true,
          },
        street:{
              type: String,
          },
        city:{
            type:String,
            required:true,
          },
        state:{
             type:String,
             required: true,
        },
        country:{
            type:String,
            required:true,
        },
        zipcode:{
            type:String,
            required:true,
        }
      },
      license:{
        type:String,
        default:"",
      },
      isVerified:{
         type:String,
         default:"Pending",
      }
},{ timestamps: true }
);

const Agent = mongoose.model<IAgent>('Agent',AgentSchema);

export default Agent;