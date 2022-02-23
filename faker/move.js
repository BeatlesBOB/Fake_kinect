
module.exports = (io) => {
    const fakerMove =  function (){
        const socket = this; 
        fakingMove(socket);
      
    };
    return {
        fakerMove,
    }
}


function fakingMove(socket){
    setTimeout(()=>{fakingMove(socket)},10)

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
        socket.emit('faker:move',response)
    }
}