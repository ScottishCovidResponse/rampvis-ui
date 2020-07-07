var Common = {};

Common.variables = {};

Common.prototype = {
    init: function() {
        Common.prototype.favouriteButtonClicked();
    },

    favouriteButtonClicked: function() {

        $('#bookmark').on('click', function(event) {

            console.log('onClickBookmark 1: ', "{{ session['token'] }}", "{{ current_user['username' }}")

            event.preventDefault();
            if ($('#bookmark').hasClass('checked')) {
                $('#bookmark').removeClass('checked');
            } else {
                $('#bookmark').addClass('checked');
            }
        });
    },

    addToFavourite: function() {
        // AJAX call add to favourite list
    },

    removeFromFavourite: function() {
        // AJAX call remove from favourite list
    }
};