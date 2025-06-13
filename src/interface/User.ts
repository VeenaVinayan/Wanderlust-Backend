export interface Iuser{
    id:string;
    name:string;
    email:string;
    phone:string;
    status:boolean;
    role:string;
}
export interface IUpdateUser{
     id: string;
     name : string;
     phone: string;
}
export interface IPassword{
     oldPassword: string;
     newPassword: string;
     confirmPassword: string;
}