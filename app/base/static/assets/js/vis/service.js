
let API = 'http://localhost:2000/api/v1/bookmark/'

class Service {

    static createBookmark(pageId, token) {
          console.log('Service: createBookmark: pageId = ', pageId, ', token = ', token);

          return $.ajax( {
            url: API,
            type: 'POST',
            data: {
                pageId: pageId,
            },
            beforeSend : function( xhr ) {
              xhr.setRequestHeader( "Authorization", "Bearer " + token );
            },
            success: function( response ) {
                return true;
            }
        });
    }

    static getBookmarkInfo (pageId, token){
        return $.ajax( {
            url: API + pageId,
            type: 'GET',
            beforeSend : function( xhr ) {
              xhr.setRequestHeader( "Authorization", "Bearer " + token );
            },
            success: function( response ) {
                return true;
            },
            error: function(){
                return false;
            }
        });
    }

    static removeBookmark (pageId, token) {
          console.log('Service: createBookmark: pageId = ', pageId, ', token = ', token);

          return $.ajax( {
            url: API + pageId,
            type: 'DELETE',
            beforeSend : function( xhr ) {
              xhr.setRequestHeader( "Authorization", "Bearer " + token );
            },
            success: function( response ) {
                return true;
            }
        });
    }

     static getAllBookmarks() {
         // python side
     }

}
