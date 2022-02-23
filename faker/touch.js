
module.exports = (io) => {
    const fakerTouch =  function (){
        const socket = this; 
        fakingTouch(socket);
      
    };
    return {
        fakerTouch,
    }
}


function fakingTouch(socket){
    let time =  (Math.floor(Math.random()*(30-1+1))+1)*1000
    setTimeout(()=>{fakingTouch(socket)},time)

    let nb_peoples = Math.floor(Math.random()*(8-1+1))+1;
    let personnes = []
    let response;
    for(var i = 0;  i < nb_peoples; i++) {
        response = {"nb_peoples": nb_peoples}
        personnes.push({
            "right_hand": {
                "x": Math.random(),
                "y": Math.random(),
            },
            "left_hand": {
                "x": Math.random(),
                "y":  Math.random(),
            },
        })          
    }
    response["peoples"] = personnes
    if(response){
        socket.emit('faker:touch',response)
    }
}