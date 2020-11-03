

const info = (message, type) => {
  
    if (type === "all"){
        console.log(message)
    }
    //console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
     info, error
}


// example use:
//logger.resolvers("hello this is logger", "Q_allFolders", false, true)

/*
const resolvers = (message, type, mute, last) => {
    const Q_allFolders = 1
    const M_createUser = 0
    const M_login = 0
    const M_addFolder = 0



    //console.log("entered resolver")
    if (Q_allFolders || M_createUser || M_login || M_addFolder){
        //console.log("------Resolvers Info-------")
        //console.log("eval", eval(type + " === 1"));
        //console.log("!mute", !mute);
        if (eval(type + " === 1") && !mute){
            resolver_logs.concat(message)
        }
        //console.log("------Resolvers END-------")
    }

    if ((Q_allFolders || M_createUser || M_login || M_addFolder) && last){
        console.log("------Resolvers Info-------")
        //console.log("eval", eval(type + " === 1"));
        //console.log("!mute", !mute);
        resolver_logs.map((message) => console.log(message));
        console.log("------Resolvers END-------")
    }

    //console.log(...params)
}
*/