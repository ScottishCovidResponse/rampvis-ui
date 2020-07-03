var Common = {};

Common.variables = {};

Common.prototype = {
    init: function() {
        Common.prototype.favouriteButtonClicked();
    },

    favouriteButtonClicked: function() {
        $('#fav-vis').on('click', function(event) {
            event.preventDefault();
            if ($('#fav-vis').hasClass('checked')) {
                $('#fav-vis').removeClass('checked');
            } else {
                $('#fav-vis').addClass('checked');
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