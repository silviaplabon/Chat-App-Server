const users = [];
console.log(users)
const addUser = ({ id, name, room }) => {
    console.log(name, id, room)
    const roomda=room;
    // name = name.trim().toLowerCase();
    // room = room.trim().toLowerCase();
   
    const existingUser = users.find((user) => user.room === room && user.name === name);
    const usersInARoom = users.filter((user) => user.room === room);
    // const roomFinding = users.find((user) => user.room === room);
    //comment out 
    // const roomdata = room.split('_');
    // const newroom = roomdata[1] + '_' + roomdata[0];

    let roomInformation;
    // console.log(newroom,"newroom")
    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };
    if (usersInARoom.length >=2 ) return { error: 'Only two person are allowed' }
    // const existingRoomSender = users.find((user) => user.room === room);
    // const existingRoomReceiver = users.find((user) => user.room === newroom);
    // if (existingRoomSender) {
    //     room=roomInformation
    // }
    // if(existingRoomReceiver){
    //      room=newroom;
    // }
    const user = { id, name, room };
    console.log(user,"user information available")
    if(usersInARoom.length<2 ){
        users.push(user);
        console.log(users,"users information")
    }
    return { user };
}

const removeUser = (id) => {
    console.log(users,"users from remove user")
    const index = users.findIndex((user) => user.id === id);
    console.log(index);
    if (index !== -1) return users.splice(index, 1)[0];
    console.log(users,"after removing")
}

const getUser = (id) =>{
    const datas=users.find((user) => user.id=== id);
    return datas;
};

const roomIsAlreadyCreated=()=>{
    const datas=users.find((user) => user.id=== id && user.name==name);

}

const getUsersInRoom = (room) => users.filter((user) => user.room === room);
const getFromAllUsers=(name)=>users.find((user)=>user.name===name)

module.exports = { addUser, removeUser, getUser, getUsersInRoom,getFromAllUsers,roomIsAlreadyCreated};