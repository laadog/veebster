var express = require('express');
var router = express.Router();
var x = require('../lib/connections')
const bcrypt   = require('bcrypt');
var lib = require('../lib/scripts')

router.get('/session', (req, res)=>{
    res.json(req.session)
})

router.use('*', (req, res, next)=>{// Rate limiter by sessions
    let c = 1000
    let ts = Date.now()
    if(req.session.lastTs){
        if(req.session.lastTs > ts-c){
           return res.send({ok:false, err:"Cooldown"})
        }
        req.session.lastTs = ts
           return next()
    }
    else{
        req.session.lastTs = Date.now()
        return next()
    }

})

router.post('/auth', function(req, res) {
    if(req.session.uid){
        res.send({ok:false, err:"You are already logged in!"})
    }
    else if(lib.validEmail(req.body.email) && lib.validPassword(req.body.password)){
        x.db.query('SELECT * FROM user WHERE email = ?', [req.body.email], (err, result)=>{
            if(result.length){
                bcrypt.compare(req.body.password, result[0].password, (err, match)=>{
                    if(match === true){
                        if(result[0].vertify){return res.send({ok:false, err:"Account not vertified"})}  // Kinnitamata
                        else{

                            // Beta
                            // let identifier = lib.makeCode()
                            // lib.socketUsers.push({email: result[0].email, identifier:identifier})
                            // res.cookie("socket", identifier)

                            //
                            req.session.uid = result[0].id
                            req.session.email = result[0].email
                            req.session.firstName = result[0].firstName
                            req.session.lastName = result[0].lastName
                            return res.send({ok: true, credits: 0,email:req.body.email}) // Korras    
                        }
                    }                
                    else{
                        return res.send({ok: false, err:"Password and email does not match!"}) // Vale parool
                    }
                })
            }
            else{
                return res.send({ok:false, err:"No account with given email!"}) // Kasutajat pole
            }
        })
    }else{


    res.status(400)
    res.send({ok:false, err:"Parameters missing."})
    }
});

router.post('/new', (req, res)=>{
    if(req.session.uid){
        res.send({ok:false, err:"You are already logged in!"})
    }
    else if(lib.validEmail(req.body.email) && lib.validPassword(req.body.password) && req.body.firstName && req.body.lastName){
        var code = lib.makeCode()
        bcrypt.hash(req.body.password, 10, (err, password)=>{
            x.db.query('INSERT INTO user(email, password, vertify, firstName, lastName) VALUES(?, ?, ?, ?,?)', [req.body.email, password, code, req.body.firstName, req.body.lastName], (err, result)=>{
            if(err){return res.send({ok:false, err:"User with this email already exists!"})};
                x.gmail.sendMail({from: 'veebisulane@gmail.com', to: req.body.email, subject: 'Veebster account vertification link.', text: `Click the following link to confirm your email address: https://veebster.tk/api/user/vertify/${code}`}, (error, info)=>{
                    console.log(error)
                    console.log(info)
                })
            return res.send({ok:true})
        })
        })

    }
    else{
        res.json({ok:false, err:"Invalid form parameters!"})
        
    }
})

router.post('/changepass', (req, res)=>{
    if(!req.session.uid) return res.send({ok:false, err:"NoAuth"})
    else if(lib.validPassword(req.body.password), lib.validPassword(req.body.newpass)){
        x.db.query("SELECT password FROM user WHERE id = ?", [req.session.uid], (err, tat)=>{
            bcrypt.compare(req.body.password, tat[0].password, (err, match)=>{
                if(!match) return res.send({ok:false, err:"Current password is wrong."})
                   bcrypt.hash(req.body.newpass, 10, (err, hash)=>{
                       if(err) throw err
                       x.db.query("UPDATE user SET password = ? WHERE id = ?", [hash, req.session.uid], (err2, tat) =>{
                           req.session.destroy()
                           return res.send({ok:true})
                       })
                   })
            })
        })
    }
    else{
        res.send({ok:false, err:"InvalidParams"})
        res.end()
    }
})

router.post('/changename', (req, res)=>{
    if(!req.session.uid) return res.send({ok:false, err:"NoAuth"})
    else if(req.body.firstName && req.body.lastName){
        x.db.query("UPDATE user SET firstName = ?, lastName = ? WHERE  id = ?", [req.body.firstName, req.body.lastName, req.session.uid], (err, rese)=>{
            if(rese.changedRows){
                req.session.firstName = req.body.firstName
                req.session.lastName = req.body.lastName

            }
            res.json({ok:true})
        })
    }
    else{
        res.send({ok:false, err:"Invalid form parameters!"})
        res.end()
    }
})

router.post('/getrecovery', (req, res)=>{
    if(req.session.uid){return res.send({ok:false, err:"AlreadyIn"})}
    else if(lib.validEmail(req.body.email)){
        var code = lib.makeCode()
        x.db.query('UPDATE user SET recovery = ? WHERE email = ? AND vertify IS NULL AND recovery IS NULL', [code, req.body.email], (err, result)=>{
            if(result.affectedRows == 0)return res.send({ok:false, err:"Account with this email does not exist or recovery link already sent."})
            x.gmail.sendMail({from: 'veebisulane@gmail.com', to: req.body.email, subject: 'Veebster account recovery link.', text: `Click on link to change password. https://veebster.tk/changepass/?${code}`}, (error, info)=>{
            })

            return res.send({ok:true})
        })
    }
    else{
        res.send({ok:false, err:"InvalidParams"})
        res.end()
    }
})

router.post('/newpass', (req, res)=>{
    if(req.session.uid){return res.send({ok:false, err:"AlreadyIn"})}
    if(req.body.code && req.body.password && req.body.code.length > 20 && req.body.password.length > 5){
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
            x.db.query("UPDATE user SET password = ?, recovery = NULL WHERE recovery = ?", [hash, req.body.code], (err, result) => {
                res.send({ok:true})
            }) 
        })

    }
    else{
       res.send({ok:false, err:"Parameters not valid."})
       res.end()
    }
})

router.get('/vertify/:code', (req, res)=>{
        x.db.query('UPDATE user SET vertify = NULL WHERE vertify = ?', [req.params.code])
        res.redirect("https://veebster.tk/login")
})

router.get('/logout', (req, res)=>{
    if(req.session.uid){
        req.session.destroy()
        return res.send({ok:true})
    }
    res.send({ok:false, err:"NoAuth"})
})



router.use('*', function(req, res) {
    res.send({ok:false, err:"This route doesn't exist!", path:req.path})
});

module.exports = router;
