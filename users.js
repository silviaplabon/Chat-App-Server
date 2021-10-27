const users = [];
console.log(users)
const addUser = ({ id, name, room }) => {
    console.log(name, id, room)
    // name = name.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.room === room && user.name === name);
    const usersInARoom = users.filter((user) => user.room === room);

    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };
    if (usersInARoom.length >=2 ) return { error: 'Only two person are allowed' }
  
    const user = { id, name, room };
    console.log(user,"user information available")

    if(usersInARoom.length<2 ){
        users.push(user);
        console.log(users,"users information")
    }
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    console.log(index);
    if (index !== -1) return users.splice(index, 1)[0];
    console.log(users,"after removing")

}

const getUser = (id) =>{
    const datas=users.find((user) => user.id=== id);
    return datas;
};
const senderIsAvailableReceiverRoom=(receiverroom,senderroom,sender,receiver)=>{
    const senderIsAvailableReceiver=users.find((user) => user.name===sender && user.room===receiverroom);
    const receiverIsAvailableSender=users.find((user) => user.name===receiver && user.room===senderroom);
   if(senderIsAvailableReceiver || receiverIsAvailableSender){
       return true;
   }
   else{
       return false;
   }
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getFromAllUsers=(name,room)=>users.find((user)=>user.name===name&& user.room!==room);

const getAllUser=()=>{ console.log(users,"users from get all users")}

console.log(users,"users in a room")
const deleteAllPreviousData=(name)=>{
  for(var i=0;i<users.length;i++){
      if(users[i].name==name){
          console.log(users[i])
          console.log(users,"users delete all previous data")
          users.splice(i,1)
      }
  }
}



module.exports = { addUser,getAllUser, removeUser, getUser, getUsersInRoom,getFromAllUsers,senderIsAvailableReceiverRoom,deleteAllPreviousData};