'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => { //to add or alter the table

    //userid will be a foreign key and coming from the user's table
    //userid column in the products table references the user's table(userid column)
    return queryInterface.addConstraint('Products', ['userid'], {
      type: 'foreign key',
      name: 'userid-foreignkey-in-proudcts',
      references: { //Required field
        table: 'Users',
        field: 'id'
        }
      }
    ) //sequelize v5 version
   
    // return queryInterface.addConstraint(
    //   'Products',
    //   ['userid'], { //which column
    //     type: 'FOREIGN KEY', //type of constraint
    //     reference: {
    //       name: 'userid-foreignkey-in-proudcts', //reference name of constraint 
    //       table: 'Users',
    //       field: 'id'
    //     }
    //   }
    // )

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => { //to remove the up function's constraint
  
    return queryInterface.removeConstraint(
      'Products',
      'userid-foreignkey-in-proudcts'
    )
  
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
