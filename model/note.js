const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize('note', undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  // SQLite only
  storage: path.join(__dirname, '../database/database.sqlite')
});

// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

/*
安装是否成功
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// node note.js
http://docs.sequelizejs.com/manual/installation/getting-started
*/

const Note = sequelize.define('note', {
	text: {
    	type: Sequelize.STRING
	},
	uid: {
		type: Sequelize.INTEGER
	},
	username: {
		type: Sequelize.STRING
	},
	createdAt: {
		type: Sequelize.STRING
    },
    updatedAt: {
      	type: Sequelize.STRING
    }
},{
	timestamps: false
});
Note.sync()

// Note.create({ text: 'hello world'});

/*
创建数据库
// force: true will drop the table if it already exists
Note.sync({force: true}).then(() => {
  	// Table created
  	Note.create({
    	text: 'hello world'
  	});
}).then(() => {
	Note.findAll({raw: true}).then(notes => {
	  console.log(notes)
	})
})
*/
/*
// 查询数据
Note.findAll({raw: true, where: {id:2}}).then(notes => {
  console.log(notes)
})
*/

module.exports = Note;
