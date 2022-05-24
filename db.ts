// 引入 sequelize 套件
const { Sequelize } = require('sequelize');

// 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
const sequelize = new Sequelize('database', 'root', 'franky123', {
  host: 'dogecoin.idv.tw',
  port: 52222,
  dialect: 'mysql'
});

async function test() {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
};

test();

export { sequelize };



