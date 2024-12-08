var eesnimed = ["Kuldne","Enesekindel", "Raudne","Hõbedane","Punane", "Kollane", "Roheline", "Suur", "Tark", "Tilluke", "Pehme", "Hiiglaslik", "Kollane", "Väike", "Uus", "Kallis", "Paha", "Pikk", "Kena", "Terane", "Pime", "Kindel", "Puhas", "Must", "Sõbralik", "Soe", "Kuri", "Hirmus", "Tugev", "Kerge", "Imelik", "Noor"]                                                                                                                                                                                                        
var taganimed = ["Pääsuke", "Orav", "Siil", "Juttselg-hiir", "Leethiir", "Koduhiir", "Uruhiir", "Rändrott", "Kodurott", "Vesirott", "Kobras", "Kodukass", "Ilves", "Kährik", "Rebane", "Pruunkaru", "Metsnugis", "Naarits", "Tuhkur", "Nirk", "Saarmas", "Kärp", "Hunt", "Põder", "Metskits", "Metssiga", "Jänes", "Nahkhiir", "Hüljes", "Viigerhüljes", "Pringel", "Pisihiir", "Kurg", "Haug", "Ahven", "Tihane"]

var socketUsers = []

function getName(){
    return eesnimed[Math.floor(Math.random()*eesnimed.length)]+ " " + taganimed[Math.floor(Math.random()*taganimed.length)]
}

function findBetween(from, to, text){
    text = text.substring(text.indexOf(from)+from.length)   
    var res = text.substring(0, text.indexOf(to))
    return {res, text}
}

const getCookies = (req) => {
    // We extract the raw cookies from the request headers
    if(!req.headers.cookie){
        return []
    }

    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
   
    const parsedCookies = {};
    rawCookies.forEach(rawCookie=>{
    const parsedCookie = rawCookie.split('=');
    // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
     parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
   };

function makeCode(len = 54) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuv0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < len; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

errors = []

function error(message){
    errors.push(message)
    console.log("\x1b[31m", "ERR: ", message, "\x1b[0m")
}

function log(message){
    console.log("\x1b[33m", message, "\x1b[0m")
}

function success(message){
    console.log("\x1b[32m","DONE:", message, "\x1b[0m")
}

function getErrors(){
    console.log("Emitted errors: ///")
    errors.forEach(element => {
        console.log(element)
    });
    console.log("///////////////////")
}

function validEmail(email){
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return reg.test(email)
}

function validDomain(domain){
    var reg = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/
    return reg.test(domain)
}

function validEval(item, list=[]){
    for(var i =0;i< list.length;i++){
        if(list[i] == item){return true}
    }
    return false
}

function validPassword(password=""){
    if(password.length > 5) return true
    return false
}

module.exports = {
    getName,
    makeCode,
    findBetween,
    error,
    getErrors,
    log,
    success,
    validEmail,
    validDomain,
    validEval,
    validPassword,
    getCookies,
    socketUsers
}