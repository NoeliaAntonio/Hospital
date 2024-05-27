var express = require('express');

var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require ('./models/db_controller');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());


module.exports =router;

router.get('/',function(req,res){

    res.render('setpassword.ejs');/*quien es? */
});

router.post('/',function(req,res){

    var token = req.body.token;
    db.checktoken(token,function(err,result){
        
        if (result.length > 0 ){

            console.log(result);
            var newpassword = req.body.password;
            var id =result[0].id;
            db.setpassword(id,newpassword,function(err,result1){
                if(err){
                   // console.log('token did not match');
                    res.send('el token no coincide');
                }
                else{
                    res.send('La contraseña ha sido cambiada... Ir a la página de inicio de sesión');
                }
                
            });
           
        }
        else {
            res.send('¡¡¡El token no coincide!!!');
        }
           
        
    });
});