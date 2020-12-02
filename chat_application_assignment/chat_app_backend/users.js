const users = []

const addUser = ({id , firstName , lastName , email , defaultRoom }) =>{
    if(firstName != '' && lastName != '' && email != '' && defaultRoom != undefined){
        const existingUser = users.find((user)=>user.id === id);

        var onlineUser = {
            id,
            firstName,
            lastName,
            email,
            defaultRoom
        }

        if(existingUser){    
            return { error :'user already in'}
        }else{
            var itemIndex = users.findIndex(user =>user.email == email);
            if(users[itemIndex]){
                console.log(users)
                users[itemIndex] = onlineUser
            }else{
                users.push(onlineUser);
            }

        }
        console.log(users)

        return {onlineUser};
    }

    return { error : 'incomplete user date'}

}

const removeUser = (id)=>{

    const index = users.findIndex((user)=>user.id===id);

    if(index !== -1){
        users.splice(index,1);
    }
}

const getUser = (id) =>users.find((user)=>user.id ===id)



const getOnlineUsers = () => users ;

module.exports = {addUser,removeUser , getUser , getOnlineUsers};