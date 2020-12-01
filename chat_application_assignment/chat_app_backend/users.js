const users = []

const addUser = ({id , firstName , lastName , email , defaultRoom }) =>{
    if(firstName != '' && lastName != '' && email != '' && defaultRoom != undefined){
        const existingUser = users.find((user)=>user.id === id)
        if(existingUser){    
            return { error :'user already in'}
        }

        var onlineUser = {
            id,
            firstName,
            lastName,
            email,
            defaultRoom
        }
        console.log(users)
        users.push(onlineUser);

        return {onlineUser};
    }

    return { error : 'incomplete user date'}

}

const removeUser = (id)=>{

    const index = users.find((user)=>user.id===id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) =>users.find((user)=>user.id ===id)



const getOnlineUsers = () => users ;

module.exports = {addUser,removeUser , getUser , getOnlineUsers};