import { sequelize } from './db';
import { Model, DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    // 定義 Model 屬性
    firstName: {     　　　 // 欄位名稱
        type: DataTypes.STRING,  //  資料型態
        allowNull: false　　　// 能不能為空，預設是 true
    },
    lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
    }
}, {
    // Other model options go here
});

sequelize.sync().then(() => {
    // 寫入對映欄位名稱的資料內容
    User.create({
        // 記得 value 字串要加上引號
        firstName: 'Heidi',
        lastName: 'Liu'
    }).then(() => {
        // 執行成功後會印出文字
        console.log('successfully created!!')
    });
});


