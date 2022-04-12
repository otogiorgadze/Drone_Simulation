let flight = [
    { height:"260", availability:"available", arrive:"empty"},
    { height:"270", availability:"available", arrive:"empty"},
    { height:"280", availability:"available", arrive:"empty"},
    { height:"290", availability:"available", arrive:"empty"},
    { height:"300", availability:"available", arrive:"empty"},
    { height:"310", availability:"available", arrive:"empty"},
    { height:"320", availability:"available", arrive:"empty"},
    { height:"330", availability:"available", arrive:"empty"},
    { height:"340", availability:"available", arrive:"empty"},
    { height:"350", availability:"available", arrive:"empty"},
    { height:"360", availability:"available", arrive:"empty"},
    { height:"370", availability:"available", arrive:"empty"},
    { height:"380", availability:"available", arrive:"empty"},
    { height:"390", availability:"available", arrive:"empty"},
    { height:"400", availability:"available", arrive:"empty"}
];
let time_left = {};
function wait_time(){
    return Math.floor(Math.random() * 15) + 1;
}
function distance(){
    return Math.floor(Math.random() * 5) + 1;
}
function mins_and_secs(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function core(i, distance){
    let indexOfObj = flight.findIndex(o => o.availability === 'available');
    if(indexOfObj >= 0){
        flight[indexOfObj].availability = i;
        // 1 mile = 5280 feet
        // 1 h = 60m
        let take_off_and_departure = ((flight[indexOfObj].height/5280)/30)*2*60;
        let flight_time = (distance/30)*60;
        // Miliseconds
        flight[indexOfObj].arrive= new Date(Date.now()+((take_off_and_departure+flight_time)*60000));
        console.log(new Date()+': Drone '+flight[indexOfObj].availability+' approved for take-off at altitude '+flight[indexOfObj].height);
        return true;
    }else{
        console.log(new Date()+': Drone '+i+' declined take-off.');
        approval(i, distance);
        return false;
    }
}
function passenger(wait, i){
    setTimeout(() => {
        console.log(new Date()+": A passenger arrived for Drone "+i+".");
        core(i, distance());
    }, wait);
}
function approval(i, distance){
    let refresh = setInterval(function(){
        if(core(i, distance)){
            clearInterval(refresh);
        }
    }, 60000);
}
function run(i){
    let wait = wait_time()*100*60;
    time_left[i] = new Date(Date.now()+wait);
    passenger(wait, i);
}
let ticker = 0;
setInterval(function(){
    ticker++;
    let landed = flight.findIndex(o => o.arrive <= Date.now());
    if(landed >= 0) {
        console.log(new Date().toString()+': Drone '+flight[landed].availability+' landed.');
        flight[landed].availability = "available";
        flight[landed].arrive = "NULL";
    }
    for (let i = 1; i <= 20; i++) {
        let in_air = flight.findIndex(o => o.availability === i);
        if(in_air >= 0){
            let left = mins_and_secs(flight[in_air].arrive - new Date());
            $('.drones div').eq(i).html(i+" # (AIR) Time left till landing -"+left);
        }else if(time_left[i] > new Date()){
            let left = mins_and_secs(time_left[i] - new Date());
            $('.drones div').eq(i).html(i+" # (Ground) Time left till a passenger arrives - "+left);
        }else if(time_left[i] <= new Date()){
            let left = mins_and_secs(time_left[i] - new Date());
            $('.drones div').eq(i).html(i+" # (Ground) Waiting to request a take off again");
        }else if(ticker < 14400){
            run(i);
        }else{
            $('.drones div').eq(i).html(i+" # (Ground) Landed");
        }
    }
    if(ticker >= 14400){
        alert("The simulation has been running for 4 hours! If you'd like to let all the drones land please click OK");
    }
},1000);
for (let i = 1; i <= 20; i++) {
    run(i);
}