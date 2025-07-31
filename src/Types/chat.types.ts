export type IChatUsers ={
    _id : string;
    name : string;
    lastMessageTime:Date;
    lastMessage:string;
    unreadCount:number;
}
export type TChatMessage= {
    _id:string,
    messages:{
        sender:string,
        receiver:string,
        message:string,
        createdAt:Date,
        isRead:boolean,
    }
}
export type TMessage={
    sender:string;
    receiver:string;
    content:string;
    createdAt:Date
    isRead:boolean;
}
