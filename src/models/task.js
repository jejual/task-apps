'use strict';

const {
    Model
} = require('sequelize');

const uuidv1 = require('uuid').v1;

module.exports = (sequelize, DataTypes) => {
    class Tasks extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    
    Tasks.init({
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            defaultValue: function () {
                return uuidv1();
            }
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        modelName: 'tasks',
    });
    return Tasks;
};