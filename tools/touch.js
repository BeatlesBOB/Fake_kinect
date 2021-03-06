let isOpen = false;
let offset = 0.05;

function findDistWall(kinect) {
    return new Promise((resolve, reject) => {
        
        if (kinect.open()) {
            console.log("Kinect Opened");
            let distWall = [];
    
            kinect.on('bodyFrame', function(bodyFrame){
                for(var i = 0;  i < bodyFrame.bodies.length; i++) {
                    if (bodyFrame.bodies[i].tracked) {
                        distWall.push(bodyFrame.bodies[i].joints[3].cameraZ)
                    }
                }
            });
            
            if(!isOpen){
                isOpen = kinect.openBodyReader()
            }

            setTimeout(function(){
                if(distWall.length>0){
                    kinect.removeAllListeners('bodyFrame');
                    kinect.close();
                    isOpen = false;
                    resolve(distWall);
                }else{
                    findDistWall(kinect)
                }
            },5000);
        } else {
            console.log("Kinect could not be openend");
        }
    });
}

function numAverage(a) {
    let b = a.length,
        c = 0, i;
    for (i = 0; i < b; i++){
      c += Number(a[i]);
    }
    return c/b;
}

module.exports = (io,kinect) => {
    const touch = async function(){
        const socket = this;
        let distArray = []
        distArray = await findDistWall(kinect)
        let avgDist = numAverage(distArray)
        if (kinect.open()) {
            kinect.on('bodyFrame',(bodyFrame) => {
                let nb_peoples = 0;
                let personnes = []
                let response
                for(var i = 0;  i < bodyFrame.bodies.length; i++) {
                    if (bodyFrame.bodies[i].tracked && (bodyFrame.bodies[i].joints[7].cameraZ >= avgDist-offset  || bodyFrame.bodies[i].joints[11].cameraZ >= avgDist-offset)) {
                        nb_peoples++
                        response = {"nb_peoples": nb_peoples}
                        let people = {}
                        if(bodyFrame.bodies[i].joints[7].cameraZ >= avgDist-offset){
                            people["left_hand"] = {
                                "x": bodyFrame.bodies[i].joints[7].colorX,
                                "y": bodyFrame.bodies[i].joints[7].colorY,
                            }
                        }
                        if(bodyFrame.bodies[i].joints[11].cameraZ >= avgDist-offset){
                            people["right_hand"] = {
                                "x": bodyFrame.bodies[i].joints[11].colorX,
                                "y": bodyFrame.bodies[i].joints[11].colorY,
                            }
                        }
                        personnes.push(people)
                    }
                }
                response["peoples"] = personnes
                if(response){
                    //console.log(response)
                    socket.emit('touch',response)
                }
            });
            if(!isOpen){
                kinect.openBodyReader();
            }
        } else {
            console.log("Kinect could not be openend");
        }
    };
    return {
        touch
    }
}