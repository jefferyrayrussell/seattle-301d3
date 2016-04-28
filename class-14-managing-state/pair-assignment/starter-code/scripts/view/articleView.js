(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn)) / 60 / 60 / 24 / 1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  //The purpose of this method is to fill the author and category dropdown menus with all the authors and categories of each of our articales. When this function is run it first declares two variables options and template. Template is used for later when we want to use hanndlebars to compile the content and put it into our script template in the index page. After this the options variable is being set to a value. This value is determined by the following chain: first it is running a method called allAuthors on our Article object. This method makes an array out of all the article author names. And then an array method is performed on this array. THis is running a function that creates a template for each author so that it can be used with handlebars. Then an if statement is run to prevent duplication of author names in the dropdown. It says if the lenfth of option under the author filter id is less than two then append it to the index page.  Then after this the process is repeated for the category dropdown. This one uses a different approach but the end result is still achieved.
  articleView.populateFilters = function() {
    var options,
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // COMMENT: What does this method do?  What is it's execution path?

  //This method makes it so the dropdowns actually work when you select an item from the menu. WHen it is called a jquery method is run on the section of the index page with the id of filters. This method ensures that the function is executed once for each item. Change refers to an event that happens. Select is the data that will be passed into the event handler which the next parameter in the function. Inside this function resource is set to either author or category by replacing the id of say 'author-filter' with just author so that this variable can be passed into the page function in the next line. Then this function is called and which takes in a url that has a concatenation. This concatenation takes in a / followed by either 'author' or 'category' and then another / followed by this expression which makes it so the author names have no whitespaces but plus's instead.
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      resource = this.id.replace('-filter', '');
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };
  // articleView.handleAuthorFilter = function() {
  //   $('#author-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-author="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#category-filter').val('');
  //   });
  // };
  //
  // articleView.handleCategoryFilter = function() {
  //   $('#category-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-category="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#author-filter').val('');
  //   });
  // };

  // DONE: Remove the setTeasers method, and replace with a plain ole link in the article template.
  // articleView.setTeasers = function() {
  //   $('.article-body *:nth-of-type(n+2)').hide();
  //
  //   $('#articles').on('click', 'a.read-on', function(e) {
  //     e.preventDefault();
  //     $(this).parent().find('*').fadeIn();
  //     $(this).hide();
  //   });
  // };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // COMMENT: What does this method do?  What is it's execution path?

  //This method makes its so our content gets onto the page when first loaded. First  the section an with id of 'articles' is shown on the page and then it hides all the siblings of this section. Then the container article within this section is removed. Then a forEach method is run through each of the elements of articles and renders each article on to the page in the section with an id of articles. Then the filters are populated.
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    // COMMENT: What does this method do?  What is it's execution path?
    //this method does everyrthing we described above, it is just being called here.
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
