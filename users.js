
const users = [];
console.log(users)
const addUser = ({ id, name, room }) => {
    console.log(name, id, room)
    // name = name.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.room === room && user.name === name);//checking if the user is existing in same room 
    const usersInARoom = users.filter((user) => user.room === room);
    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };
    if (usersInARoom.length >= 2) return { error: 'Only two person are allowed' }
    const user = { id, name, room };
    console.log(user, "user information available")
    if (usersInARoom.length < 2) {
        users.push(user);
    }
    return { user };
}

// remove user by only socket id 
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    console.log(index);
    if (index !== -1) return users.splice(index, 1)[0];
}

//remove user by name ,room, id. After changing receiver room id equal to sender room
const removeUserByNameRoom = (name, room, id) => {
    const index = users.findIndex((user) => user.id === id && user.room == room && user.name == name);
    console.log(index,name,room,id, users, "remove users by name and room")
    if (index !== -1) { users.splice(index, 1)[0];}
}

const getUser = (id) => {
    const datas = users.find((user) => user.id === id);
    return datas;
};
const getUserByName = (name) => {
    const datas = users.find((user) => user.name === name);
    return datas;
}

const availableOneAnotherRoom = (sender, receiver) => {
    const senderIsAvailableReceiver = users.find((user) => user.name === sender && user.room === receiver);
    const receiverIsAvailableSender = users.find((user) => user.name === receiver && user.room === sender);
    if (senderIsAvailableReceiver || receiverIsAvailableSender) {
        return true;
    }
    else {
        return false;
    }
}


const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const deleteUsersInRoomWithUser = (room) => {
    const roomUser = users.filter((user) => user.room === room);
    if (roomUser[0]) {
        const index = users.findIndex((user) => roomUser[0].id === user.id && user.room == user.room);
        if (index !== -1) return users.splice(index, 1)[0];
    }
    if (roomUser[1]) {
        const index = users.findIndex((user) => roomUser[0].id === user.id && user.room == user.room);
        if (index !== -1) return users.splice(index, 1)[0];
    }
}


const getFromAllUsers = (name, room) => users.find((user) => user.name === name && user.room !== room);

const getAllUser = () => { console.log(users, "users from get all users") }

const deleteAllPreviousData = (name) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == name) {
            console.log(users[i])
            console.log(users, "users delete all previous data")
            users.splice(i, 1)
            console.log(users, "users delete previous data")
        }
    }
}



module.exports = { addUser, getAllUser, removeUserByNameRoom, removeUser, deleteUsersInRoomWithUser, getUser, getUsersInRoom, getFromAllUsers, availableOneAnotherRoom, deleteAllPreviousData, getUserByName };