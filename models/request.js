
module.exports = function(sequelize, DataTypes) {
var Request = sequelize.define("Request", {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // ,
    // createdAt: {
    //   type: DataTypes.DATE, 
    //   allowNull: false, 
    //   defaultValue: sequelize.fn('NOW')
    // }
    // ,
    // users_id: {
    //   type: DataTypes.INTEGER,
    //   references: 'persons',
    //   referencesKey: 'id'
    // }
  },{
  	classMethods: {
  		associate: (models) => {
  			Request.belongsTo(models.User, {
  				foreignKey: 'user_id'
  				// ,
  				// as: 'user_id'
  			})
  		}
  	}
  });
  return Request;
}