var express = require('express');
var router = express.Router();
var x = require('../lib/connections')
const cities = require('all-the-cities');

router.use('*', (req, res, next)=>{// Authorization limiter
    if(req.session.uid) return next()
    return res.send({ok:false, err:"NoAuth"})
})

router.get("/", (req, res)=>{
    res.send("A")
    req.session.pages = []
    x.db.query("SELECT domain, tier, tag FROM pages WHERE owner = ?", [req.session.uid], (err, resd)=>{
    })
})

router.get("/:page/hit", (req, res)=>{ // Total count of hits
    var query = req.query
    var count = Object.keys(query).length
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (err, response)=>{
        if(response.length){
            if(query.precision === "day"){
                if(query.year && count == 2){
                    x.db.query('SELECT COUNT(*) as HITS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? GROUP BY DATE(time) ORDER BY date ;', [req.params.page, query.year], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(*) as HITS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY DATE(time)  ORDER BY date;', [req.params.page, query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(*) as HITS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time)=? GROUP BY DATE(time)  ORDER BY date;', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "hour"){
                 if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "minute"){
                if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time; ', [req.params.page,query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && query.minute && count == 6){
                    x.db.query('SELECT COUNT(*) as HITS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? AND MINUTE(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day,query.hour ,query.minute], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }


                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else{
                return res.json({ok:false, err:"NoPrecisionParam"})
            }
        }
        else{
            return res.send({ok:false, err: "noPage"})
        }
    })


})

router.get("/:page/user", (req, res)=>{ // Total count of different sessions
    var query = req.query
    var count = Object.keys(query).length
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (err, response)=>{
        if(response.length){
            if(query.precision === "day"){
                if(query.year && count == 2){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = "2022" GROUP BY DAY(time) ORDER BY date ;', [req.params.page, query.year], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY DAY(time)  ORDER BY date;', [req.params.page, query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time)=? GROUP BY DAY(time) ORDER BY date;', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "hour"){
                 if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "minute"){
                if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && query.minute && count == 6){
                    x.db.query('SELECT COUNT(DISTINCT hitter) as USERS, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? AND MINUTE(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day,query.hour ,query.minute], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }


                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else{
                return res.json({ok:false, err:"NoPrecisionParam"})
            }
        }
        else{
            return res.send({ok:false, err: "noPage"})
        }
    })


})

router.get("/:page/ip", (req, res)=>{ // Different ips.
    var query = req.query
    var count = Object.keys(query).length
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (err, response)=>{
        if(response.length){
            if(query.precision === "day"){
                if(query.year && count == 2){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? GROUP BY DAY(time) ORDER BY date;', [req.params.page, query.year], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY DAY(time);', [req.params.page, query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE(time) as DATE FROM hits WHERE page = ? AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time)=? GROUP BY DAY(time);', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "hour"){
                 if(query.year && query.month && count == 3){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY HOUR(time), DATE(time) ORDER BY time;', [req.params.page, query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else if(query.precision === "minute"){
                if(query.year && query.month && query.day && count == 4){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && count == 5){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day, query.hour], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }
                else if(query.year && query.month && query.day && query.hour && query.minute && count == 6){
                    x.db.query('SELECT COUNT(DISTINCT ip) as ips, DATE_FORMAT(time, "%Y-%m-%d-%H-%i") as DATE FROM hits WHERE page = ?  AND YEAR(time) = ? AND MONTH(time) = ? AND DAY(time) = ? AND HOUR(time) = ? AND MINUTE(time) = ? GROUP BY MINUTE(time), HOUR(time), DATE(time) ORDER BY time;', [req.params.page,query.year, query.month, query.day,query.hour ,query.minute], (ferr, fres)=>{
                        return res.json({ok:true, hits: fres})
                    })
                }


                else{
                    return res.json({ok:false, err:"InvalidParams"})
                }
            }
            else{
                return res.json({ok:false, err:"NoPrecisionParam"})
            }
        }
        else{
            return res.send({ok:false, err: "noPage"})
        }
    })


})

router.get("/:page/path", (req, res)=>{ // Hits to different paths, ordered by hitcount.
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
    if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) AS hits, path FROM hits WHERE page = ? GROUP BY path ORDER BY hits DESC;', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })

})

router.get("/:page/paths", (req, res)=>{ // Hits to different paths, ordered by hitcount.
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
    if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(DISTINCT path) as paths FROM hits WHERE page = ?', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })

})

router.get("/:page/users", (req, res)=>{ // Different sessions hitcount, ordered by last interaction.
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT hitter.id, COUNT(*) as hits, MAX(hits.time) as last, hitter.pseudonym, INET_NTOA(hitter.ip) as ip,hitter.country, hitter.device, hitter.city FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY hitter.id ORDER BY MAX(hits.time) DESC;', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/ips", (req, res)=>{ // Different sessions hitcount, ordered by last interaction.
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT INET_NTOA(ip) as ip, COUNT(*) as hits, MAX(hits.time) as last FROM hits WHERE page = ? GROUP BY hits.ip ORDER BY MAX(hits.time) DESC;', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/browser", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) as hits, hitter.browser FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY browser', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/platform", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) as hits, hitter.platform FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY platform', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/device", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) as hits, hitter.device FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY device', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/city", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) as hits, hitter.city, hitter.country FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY city;', [req.params.page], (e2, r2)=>{
            if(r2.length){
                for(var i = 0;i<r2.length;i++){
                    if(r2[i].city != ""){

                        r2[i].location = cities.filter(city =>{
                            
                            return city.name == r2[i].city
                        
                        })[0].loc.coordinates
                    }
                }

            }
            
            res.json(r2)
        })
    })
})

router.get("/:page/country", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT COUNT(*) as hits, hitter.country FROM hits INNER JOIN hitter ON hits.hitter = hitter.id WHERE page = ? GROUP BY country;', [req.params.page], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/u/:hitter/hits", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT INET_NTOA(ip) as ip, path, time FROM hits WHERE page = ? AND hitter = ? ORDER BY id DESC;', [req.params.page, req.params.hitter], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/u/:hitter/ips", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT INET_NTOA(ip) as ip, count(*) as hits, MAX(time) as last from hits where page = ? and  hitter = ? GROUP BY ip ORDER BY last desc;', [req.params.page, req.params.hitter], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/i/:ip/hits", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT hitter as hitter, path, time FROM hits WHERE page = ? AND ip = INET_ATON(?) ORDER BY id DESC;', [req.params.page, req.params.ip], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.get("/:page/i/:ip/hitters", (req, res)=>{
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?", [req.params.page, req.session.uid], (e1, r1)=>{
        if(!r1.length){return res.send({ok:false, err: "noPage"})}
        x.db.query('SELECT hitter, count(*) as hits, MAX(time) as last from hits where page = ? and  ip = INET_ATON(?) GROUP BY hitter ORDER BY last DESC;', [req.params.page, req.params.ip], (e2, r2)=>{
            res.json(r2)
        })
    })
})

router.use('*', (req, res)=>{
    res.send("On /stat router")
})

module.exports = router;
