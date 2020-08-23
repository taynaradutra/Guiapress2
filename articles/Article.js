const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    body: {
        type: Sequelize.TEXT, 
        allowNull: false
    }
})

// somente um deles
Category.hasMany(Article); // 1 - N Uma categoria tem muitos artigos
Article.belongsTo(Category); // 1 - 1 Um artigo pertence a uma categoria

Article.sync({force: false})
module.exports = Article;