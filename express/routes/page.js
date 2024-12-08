var express = require('express');
var router = express.Router();
var x = require('../lib/connections')
const bcrypt   = require('bcrypt');
var lib = require('../lib/scripts')

router.use('*', (req, res, next)=>{// Authorization limiter
    if(req.session.uid) return next()
    return res.send({ok:false, err:"NoAuth"})
})



router.post("/new", (req, res)=>{
    if(lib.validDomain(req.body.domain) && lib.validEval(req.body.plan, ["free", "standard", "premium"])){
        let tag = lib.makeCode(16)
        x.db.query("INSERT INTO pages(domain, tier, owner, tag) VALUES(?,?,?,?)", [req.body.domain, "free", req.session.uid, tag], (err, res2)=>{
            if(err){return res.send({ok:false, err:"Page with this domain already exists!"})}
            else{res.send({ok:true})}
        })
    }
    else{
        res.send({ok:false, err:"Invalid form parameters."})
    }
})

router.post("/delete", (req, res)=>{
    if(lib.validDomain(req.body.domain)){
        x.db.query("DELETE FROM pages WHERE owner = ? AND domain = ?", [req.session.uid, req.body.domain], (err, results)=>{
            if(results && results.affectedRows){
                res.send({ok:true})
            }
            else{
                res.send({ok:false, err:"No page in your account with this domain."})
            }
        })
    }
    else{
        res.status(400)
        res.send({ok:false, err:"Invalid Request"})
    }
})

router.get('/list', (req, res)=>{
    req.session.pages = []
    x.db.query("SELECT * FROM pages WHERE owner = ?", [req.session.uid], (err, res2)=>{
        for(var i = 0;i<res2.length;i++){
            req.session.pages.push(res2[i].id)
        }
        return res.send({ok:true, pages:res2})
    })
})


router.post('/:page/task', (req, res)=>{ // Add tasks
    console.log(req.body)
    if(req.body.task && (req.body.once==true || req.body.once==false)){
        if(!(!req.body.ip || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(req.body.ip))){return res.json({ok:false, err:"Provided IP not valid."})}
        x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
            if(!response.length){res.json({ok:false, err:"This page does not match authentication."})}
            else{
                if(req.body.ip && req.body.hitter){
                    x.db.query("INSERT INTO tasks(hitter, ip, task, once, page) VALUES(?, INET_ATON(?), ?,?,?)", [req.body.hitter, req.body.ip,req.body.task, req.body.once, req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Hitter with this id does not exist."})
                        }
                        return res.json({ok:true})
                    })
                }
                else if (req.body.ip){
                    x.db.query("INSERT INTO tasks(ip, task, once, page) VALUES(INET_ATON(?), ?, ?,?)", [req.body.ip, req.body.task, req.body.once, req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    })
                }
                else if(req.body.hitter){
                    x.db.query("INSERT INTO tasks(hitter, task, once, page) VALUES(?, ?, ?,?)", [req.body.hitter, req.body.task, req.body.once, req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    })
                }
                else{
                    x.db.query("INSERT INTO tasks(task, once, page) VALUES(?, ?, ?)", [req.body.task, req.body.once, req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    }) 
                }        
            }

        })

    }
    else{
        res.json({ok:false, err:"Required parameters missing."})
    }

})

router.get('/:page/task/:id', (req, res)=>{ // Remove task

    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
        if(!response.length){return res.json({ok:false, err:"Not authenticated with this page."})}
        x.db.query('DELETE FROM tasks WHERE page = ? AND id = ?', [req.params.page, req.params.id], (err1, res1)=>{
            res.json({ok:true})
        })

    })
})

router.get('/:page/tasks', (req, res)=>{ 
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
        if(!response.length){return res.json({ok:false, err:"noPage"})}
        x.db.query('SELECT INET_NTOA(ip) as ip,id, hitter, page, once, task, uses FROM tasks WHERE page = ?', [req.params.page], (err1, res1)=>{
            res.json({ok:true, tasks:res1})
        })

    })
})


router.post('/:page/ignore', (req, res)=>{ // 
        if(!(!req.body.ip || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(req.body.ip))){return res.json({ok:false, err:"Provided IP not valid."})}
        x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
            if(!response.length){res.json({ok:false, err:"This page does not match authentication."})}
            else{
                if(req.body.ip && req.body.hitter){
                    x.db.query("INSERT INTO ignorelist(hitter, ip, page) VALUES(?, INET_ATON(?), ?)", [req.body.hitter, req.body.ip, req.params.page], (err1, res1)=>{
                        if(err1){
                            console.log(err1)
                            return res.json({ok:false, err:"Hitter with this id does not exist."})
                        }
                        return res.json({ok:true})
                    })
                }
                else if (req.body.ip){
                    x.db.query("INSERT INTO ignorelist(ip, page) VALUES(INET_ATON(?), ?)", [req.body.ip, req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    })
                }
                else if(req.body.hitter){
                    x.db.query("INSERT INTO ignorelist(hitter , page) VALUES(?, ?)", [req.body.hitter,req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    })
                }
                else{
                    x.db.query("INSERT INTO ignorelist(page) VALUES(?)", [req.params.page], (err1, res1)=>{
                        if(err1){
                            return res.json({ok:false, err:"Something went wrong"})
                        }
                        return res.json({ok:true})
                    }) 
                }        
            }

        })

    

})

router.get('/:page/ignore/:id', (req, res)=>{ // 

    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
        if(!response.length){return res.json({ok:false, err:"Not authenticated with this page."})}
        x.db.query('DELETE FROM ignorelist WHERE page = ? AND id = ?', [req.params.page, req.params.id], (err1, res1)=>{
            res.json({ok:true})
        })

    })
})

router.get('/:page/ignore', (req, res)=>{ 
    x.db.query("SELECT 1 FROM pages WHERE id = ? AND owner = ?;", [req.params.page, req.session.uid], (err, response)=>{
        if(!response.length){return res.json({ok:false, err:"noPage"})}
        x.db.query('SELECT INET_NTOA(ip) as ip,id, hitter FROM ignorelist WHERE page = ?', [req.params.page], (err1, res1)=>{
            res.json({ok:true, tasks:res1})
        })

    })
})

/// Changes
router.use('*',(req, res)=>{
    res.send({ok:false, err:"NoPath"})
})

module.exports = router;
