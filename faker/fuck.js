let offset = 0.05;

function findDistWall() {
    return new Promise((resolve, reject) => {
        let distWall = [2.3,2.4,2.5];
        setTimeout(function(){
            if(distWall.length>0){
                resolve(numAverage(distWall))
            }else{
                findDistWall(kinect)
            }
        },5000);
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

module.exports = (io) => {
    const fakerFuck = async function(){
        const socket = this;
        let distArray = []
        distArray =  await findDistWall();
    };
    return {
        fakerFuck
    }
}