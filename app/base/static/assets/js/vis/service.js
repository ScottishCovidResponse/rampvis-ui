class Service {

    static createBookmark(API, pageId, token) {
        console.log('Service: createBookmark: pageId = ', pageId, ', token = ', token);

        return $.ajax({
            url: API + '/bookmark',
            type: 'POST',
            data: {
                pageId: pageId,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (response) {
                return true;
            }
        });
    }

    static getBookmarkInfo(API, pageId, token) {
        return $.ajax({
            url: API + '/bookmark/' + pageId,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (response) {
                return true;
            },
            error: function () {
                return false;
            }
        });
    }

    static removeBookmark(API, pageId, token) {
        console.log('Service: createBookmark: pageId = ', pageId, ', token = ', token);

        return $.ajax({
            url: API + '/bookmark/' + pageId,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (response) {
                return true;
            }
        });
    }

    // implemented at python side
    static getAllBookmarks() {
        return null;
    }

    static streamData(API, token, action) {
        console.log('Service: streamData: action = ', action);

        return $.ajax({
            url: API + '/stream_data/' + action,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function (response) {
                return true;
            }
        });
    }
}
