const models = require('./models')

//MARK: INSERT OBJECT INTO DATABASE
//return Dish Object that you can call and that will allow you to persist this information to the table which is behind Dish
//if we save this info, it's going to go into the dishes table in the database
/*let dish = models.Dish.build({
    name: 'Spring rolls',
    description: "These Spring rolls are tasty",
    price: 10.0
})

//going to return you a promise, and the promise will contain the new dish or the saved dish
dish.save().then((persistedDish) => {
    console.log(persistedDish)
})*/
//this particular dish will be different from the dish that youo're saving
//because this one will have id generated. because it's already saved (automatic id)


//MARK: RETREIVE INTO DATABASE

models.Dish.findOne({
    where: {
        name: 'Cake'
    }
}).then(dish => console.log(dish))


/* returns array
models.Dish.findAll({
    where: {
        name: "Spring rolls"
    }
}).then((dishes) => console.log(dishes))
*/

/*
models.Dish.findByPk(3)
.then((dish) => {
    console.log(dish)
})*/

/*
models.Dish.findAll()
.then((dishes) => {
    console.log(dishes)
})*/
//SELECT "id", "name", "description", "price", "createdAt", "updatedAt" FROM "Dishes" AS "Dish"

//MARK: UPDATE OBJECT DATABASE
models.Dish.update({
    name: "Carrot Cake",
    price: 8.0
}, {
    where: {
        id: 2
    }
}).then((updatedDish) => { console.log(updatedDish)})


//MARK: DELETE OBJECT DATABASE
models.Dish.destroy({
    where: {
        id: 4
    }
}).then((result) => console.log(result)) 
