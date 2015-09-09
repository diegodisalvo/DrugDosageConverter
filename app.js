$(function() {

    Parse.$ = jQuery;
    Parse.initialize("eFXaJfSV1sJgsWDwpXpCK2MHksiVOTa7kAjvfRgb", "c9bKfpyxbCqhdeZb62qhYS2ycnXtav0VaRWoFmIO");


    var WelcomeView = Parse.View.extend({
      template: Handlebars.compile($('#welcome-tpl').html()),
      render: function(){
        this.$el.html(this.template());
      }
    });

    // var welcomeView = new WelcomeView();
    // welcomeView.render();
    // $('.main-container').html(welcomeView.el);


//

    var OppioidiTableView = Parse.View.extend({
      template: Handlebars.compile($('#tabella-opp-tpl').html()),
      render: function(){
        var collection = { oppioide: this.collection.toJSON() };
        this.$el.html(this.template(collection));
      }
    });

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





    $(document).ready(function(){
      console.log('jq');

    })

});
