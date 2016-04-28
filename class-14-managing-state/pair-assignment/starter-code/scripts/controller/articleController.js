(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    debugger;
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // The code below defines the loadById method employed on the articlesController object. The method take two paramaters, ctx and next.  Ctx is the context object in page.js.  Next is the callback function that directs the next function in the execution path to be run.  When the method loadById is called, the function articleData is created and takes in a single parameter called article.  When articleData runs it takes the property articles from the context object and defines that as article which was the parameter taken in by articleData.  The callback function next is run.  The execution order continues.  This method has not been called yet, it is just being defined.

  // Then loadById runs a method called findWhere on the object Article.  This method takes three parameters: "id", ctx.params.id, and articleData which was defined above.  Findwhere is a method that is selecting from our article object the field that is 'id'.  In the article.js file this method is defined as a function enacting a sql query.  Id is a property on the object Article which is stored in a table and selects all the data in the table with the label id.

  //The purpose of this code is to take the identified data from the articles table and ready it to be displayed when the url is requested.

  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // This is a similar method as that desccribed above.  Instead of isolating the data labeled as id, it focuses on the data in the author column of the table. The findWhere method is run on the Article.  Replace is a string method that replaces a blankspace with a plus.  This is necessary so that the url is read correctly. The author data is taken from the table.  The authorData function runs and prepares the information to be placed on the index page when an author is selected from the drop down menu.

  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // Similarly, this code below identifies the data designated as category in the          articles table and gives it the value articlesInCategory. The categoryData function runs and prepares the information to be placed on the index page when an category is selected from the drop down menu.

  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  // The code below defines the loadAll method as a function that also takes two arguments: ctx, the context object in page.js, as well as the "next" callback function. The if condition checks to see if anything is there, if there is the execution path moves on to next.  Otherwise, it runs the fetchAll method on the Article object which generates the data that flows into the table created in the article.js file.  Even though this method is defined last, it will be run frist when the page loads.

  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articlesController = articlesController;
})(window);
