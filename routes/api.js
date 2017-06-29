var express = require('express');
var router = express.Router();

var Note = require('../model/note')

/* GET api listing. */
router.get('/notes', function(req, res, next) {
	var opts = {raw: true}
    if(req.session && req.session.user){
      opts.where = {uid:req.session.user.id }
    }
	Note.findAll({raw: true}).then(notes => {
		res.send({
    		status: 0,
    		data: notes
    	})
	}).catch(() => {
	    res.send({ status: 1,errorMsg: '数据库异常'});
	});
});

router.post('/notes/add', function(req, res, next) {
	if(!req.session || !req.session.user){
       return res.send({status: 1, errorMsg: '请先登录'})
     }
     if (!req.body.note) {
       return res.send({status: 2, errorMsg: '内容不能为空'});
     }

    var note = req.body.note;
	var uid = req.session.user.id;
    var username = req.session.user.username;
	var update =  new Date().getTime();
	// http://docs.sequelizejs.com/manual/tutorial/instances.html
	Note.create({
		text: note,
		uid: uid,
		username: username,
		createdAt: update,
    	updatedAt: update
	}).then( data  => {
		res.send({status: 0, result: data.get({ plain: true}) })
	}).catch(() => {
		res.send({
			status: 1,
			errorMsg: '数据库异常或者你没有权限'
		})
	})

});
// https://stackoverflow.com/questions/38524938/sequelize-update-record-and-return-result returning: true, plain: true
router.post('/notes/edit', function(req, res, next) {
	console.log('进入edit....')
	if(!req.session || !req.session.user){
	  return res.send({status: 1, errorMsg: '请先登录'})
	}
	var noteId = req.body.id;
	var note = req.body.note;
	var uid = req.session.user.id;
	var update =  new Date().getTime();
	Note.update({text: note, updatedAt: update },{where: {id: noteId, uid: uid }, returning: true, plain: true }).then( (lists) => {
		if(lists[1] === 0){
		    return res.send({ status: 1,errorMsg: '你没有权限'});
		}
		res.send({status: 0 })
		console.log('编辑回调', lists )
	}).catch(function(e){
    	res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  	})
});


router.post('/notes/delete', function(req, res, next) {
	console.log('进入delete....', req)
	if(!req.session || !req.session.user){
      return res.send({status: 1, errorMsg: '请先登录'})
    }
    var noteId = req.body.id;
    var uid = req.session.user.id;
	Note.destroy({
		where: {id: noteId, uid: uid}
	}).then( deleteLen => {
		if(deleteLen === 0){
	      return res.send({ status: 1,errorMsg: '你没有权限'});
	    }
	    res.send({status: 0})
	}).catch(function(e){
    	res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  	})
});


module.exports = router;
