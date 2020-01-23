import Sequelize, { Model } from 'sequelize';

export class UserDB extends Model { }

// class User extends Model {}
// User.init({
//     id: Sequelize.UUIDV4,
//     login: Sequelize.STRING,
//     password: Sequelize.STRING,
//     age: Sequelize.INTEGER,
//     isDeleted: Sequelize.BOOLEAN
// }, {
//     sequelize,
//     modelName: "user"
// });