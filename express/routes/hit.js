var express = require('express');
var router = express.Router();
var x = require('../lib/connections')
var lib = require('../lib/scripts')
var geoip = require('geoip-lite');
var useragent = require('express-useragent')

router.use(useragent.express())

router.use('*', (req, res, next)=>{

    console.log(req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if(!req.session.hitterId){
        var ipInf = geoip.lookup(req.headers["x-real-ip"]) || {country:"", city:""}
        var pack = {
            ip : req.headers["x-real-ip"],
            agent: req.headers["user-agent"],
            uid: req.sessionID,
            country: ipInf.country,
            city: ipInf.city,
            pseudonym: lib.getName(),
            device : (req.useragent.isMobile) ? "mobile" : "desktop" ,
            platform : req.useragent.platform,
            browser : req.useragent.browser
        }
        x.db.query("INSERT INTO hitter(ip, uid, country, city, pseudonym, browser, platform, device) VALUES(INET_ATON(?), ?, ?, ?, ?, ?, ? ,?)", [pack.ip, pack.uid, pack.country, pack.city, pack.pseudonym, pack.browser, pack.platform, pack.device], (err, response)=>{
            if(err) throw err
            req.session.hitterId = response.insertId
            next()
        })
    }
    else{
        next()
    }
})



router.get('/src/:tag.js', (req, res)=>{
    res.type("js")

    x.db.query('SELECT 1 FROM ignorelist  INNER JOIN pages ON page = pages.id WHERE (ignorelist.ip = INET_ATON(?) OR ignorelist.hitter = ?) AND pages.tag = ? LIMIT 1;', [req.headers["x-real-ip"], req.session.hitterId, req.params.tag], (er1, res1)=>{
        if(res1.length){
            console.log("Ignored")
            res.send("console.log('Not under logging')")
        }
        else{
            x.db.query('SELECT tasks.id, task, once FROM tasks  INNER JOIN pages ON page = pages.id WHERE (hitter = ? OR INET_ATON(?)) AND pages.tag = ?;', [req.session.hitterId, req.headers["x-real-ip"], req.params.tag], (er2, res2)=>{
                let final = "";
                if(res2.length){
                    for(var i = 0;i<res2.length;i++){
                        final += res2[i].task + "\n"
                        if(res2[i].once == 1){
                            x.db.query("DELETE FROM tasks WHERE id = ?", [res2[i].id])
                        }
                        x.db.query("UPDATE tasks SET uses = uses + 1 WHERE id = ?", [res2[i].id])
                    }
                }
                res.send(`
fetch("https://veebster.tk/api/hit/${req.params.tag}", {
method: "POST",
mode: "cors",
body: window.location.pathname,
credentials: "include",
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
})
///// Additional Tasks
${final}
                `)
            })

        }
    })
})

router.post('/:tag', (req, res)=>{
    if(!req.headers["origin"]){console.log("bad origin");return res.end()}
    var info = {
        ip: req.headers["x-real-ip"],
        tag: req.params.tag,
        path: lib.findBetween('{"', '"', JSON.stringify(req.body)).res,
        origin : lib.findBetween("://", "",req.headers["origin"]).text,
    }
    x.db.query("SELECT * FROM pages where tag = ? AND domain = ?", [info.tag, info.origin], (err, response)=>{

        if(response.length){
            x.db.query('INSERT INTO hits(page, ip, path, hitter) VALUES(?, INET_ATON(?),?, ?)', [response[0].id, info.ip, info.path, req.session.hitterId])
            x.db.query('UPDATE pages SET hitcount = hitcount + 1 WHERE id = ?', [response[0].id])
        }
    })
    res.end()
})


router.get("/info", (req, res)=>{


    var client = {
        device : (req.useragent.isMobile) ? "mobile" : "desktop" ,
        ip : req.headers["x-real-ip"],
        platform : req.useragent.platform,



    }

    res.json({
        client: client,
        useragent : req.useragent
    })


})



router.use('*', function(req, res) {
    res.send({ok:false, err:"NoPath", path:req.path})
});

module.exports = router;
