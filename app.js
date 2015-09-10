$(function() {

    Parse.$ = jQuery;
    Parse.initialize("eFXaJfSV1sJgsWDwpXpCK2MHksiVOTa7kAjvfRgb", "c9bKfpyxbCqhdeZb62qhYS2ycnXtav0VaRWoFmIO");


    var WelcomeView = Parse.View.extend({
      template: Handlebars.compile($('#welcome-tpl').html()),
      render: function(){
        this.$el.html(this.template());
      }
    });




//

    var OppioidiTableView = Parse.View.extend({
      template: Handlebars.compile($('#tabella-opp-tpl').html()),
      render: function(){
        var collection = { oppioide: this.collection.toJSON() };
        this.$el.html(this.template(collection));
      }
    });




    //Render the login View
    var LoginView = Parse.View.extend({
      template: Handlebars.compile($('#login-tpl').html()),
      events: {
          'submit .form-signin': 'login',
      },
      login: function(e){
        // Prevent Default Submit Event
        e.preventDefault();

        // Get data from the form and put them into variables
        var data = $(e.target).serializeArray(),
            username = data[0].value,
            password = data[1].value;

        // Call Parse Login function with those variables
        Parse.User.logIn(username, password, {
            // If the username and password matches
            success: function(user) {
                drugRouter.navigate('index', { trigger: true });
                window.location.reload();
            },
            // If there is an error
            error: function(user, error) {
                console.log(error);
            }
        });
      },
      render: function(){
        this.$el.html(this.template());
      }
    });


    // ROUTER
    var DrugRouter = Parse.Router.extend({

    // shared variables?

    // this runs when we start the Router
    start: function(){
      Parse.history.start();
      drugRouter.navigate('', {trigger: true});
    },

    // function to URLs
    routes:{
      '' : 'index',
      'login' : 'login',
      'logout' : 'logout',
    },

    login: function(){
      var loginView = new LoginView();
      loginView.render();
      $('.main-container').html(loginView.el);
    },

    index: function(){
      if (Parse.User.current()){
        console.log('There is a user logged in');

        var Oppiode = Parse.Object.extend('Oppiode');

        var Oppioidi = Parse.Collection.extend({
          model: Oppiode
        });

        var oppioidi = new Oppioidi();
        oppioidi.fetch({
          success: function(oppioidi){
            console.log(oppioidi);

            var oppioidiTableView = new OppioidiTableView({ collection: oppioidi });
            oppioidiTableView.render();
            $('.main-container').html(oppioidiTableView.el);
            //function to toggle the dosages of a specific drug
            var targetDiv;
            var targetDrug;
            $('.dosi').hide();
            $('.dose').hide();
            $('.farmaco').click(function(){
              //todo: need to find a way to keep track of which buttons are already active
              targetDiv = $(this).attr('href');
              targetDrug = $(this);
              $(targetDiv).toggle(300);

            });

            //function to display the equivalents
            $('.dosi button').click(function(){
              var buttonIndex = parseInt($(this).attr('id'), 10);
              console.log(buttonIndex);
              $('tr td:nth-child('+ (buttonIndex + 3)+')').toggle(300);
              $('tr th:nth-child('+ (buttonIndex + 3)+')').toggle(300);
              $('button#' + buttonIndex + '.btn').toggleClass('active');
            });

            $('.close-btn').click(function(){
              $(targetDiv).toggle(300);
            });

            //get that damned td
            $('td').click(function(){
              var td = $(this).attr('id');
              console.log("clicked " + td);
            });

            //this toggle infos about the selected drug
            $('.info').click(function(){
              $(this).children('p').toggle(300);
            });

          },
          error: function(oppioidi, error){
            console.log(oppioidi, error)
          }
        });


      } else {
        console.log('no user logged in');
        //blogRouter.navigate('login', {trigger: true});
        var welcomeView = new WelcomeView();
        welcomeView.render();
        $('.main-container').html(welcomeView.el);
      };
    },

  });

    var drugRouter = new DrugRouter();
    drugRouter.start();



    $(document).on('click', '.logout', function(e){
      e.preventDefault();
      console.log('user logging out');
      Parse.User.logOut();
      drugRouter.navigate('', {trigger: true});
      window.location.reload();
    });

    $(document).on('click', '.admin', function(e){
      e.preventDefault();
      $('.main-container').html('Io li leggo i messaggi di Anna');
    });




});
