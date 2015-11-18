// Create the BookReader object
br = new BookReader();

// Total number of leafs
br.numLeafs = vaultItem.pages;
// Book title & URL used for the book title link
br.bookTitle= vaultItem.title;
br.bookUrl  = vaultItem.root + 'items/' + vaultItem.id + '/' + vaultItem.version + '/';

// We load the images from archive.org -- you can modify this function to retrieve images
// using a different URL structure
br.getPageURI = function(index, reduce, rotate) {
    // reduce and rotate are ignored in this simple implementation, but we
    // could e.g. look at reduce and load images from a different directory
    // or pass the information to an image server
    var url = vaultItem.root + 'file/' + vaultItem.id + '/' + vaultItem.version + '/' + vaultItem.filenames + (index + 1) + '.JPG';
    return url;
}

// Return which side, left or right, that a given page should be displayed on
br.getPageSide = function(index) {
    if (0 === (index & 0x1)) {
        return 'R';
    } else {
        return 'L';
    }
}

// This function returns the left and right indices for the user-visible
// spread that contains the given index.  The return values may be
// null if there is no facing page or the index is invalid.
br.getSpreadIndices = function(pindex) {
    var spreadIndices = [null, null];
    if ('rl' == this.pageProgression) {
        // Right to Left
        if (this.getPageSide(pindex) == 'R') {
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex + 1;
        } else {
            // Given index was LHS
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex - 1;
        }
    } else {
        // Left to right
        if (this.getPageSide(pindex) == 'L') {
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex + 1;
        } else {
            // Given index was RHS
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex - 1;
        }
    }

    return spreadIndices;
}

// For a given "accessible page index" return the page number in the book.
//
// For example, index 5 might correspond to "Page 1" if there is front matter such
// as a title page and table of contents.
br.getPageNum = function(index) {
    return index + 1;
}

// Override the path used to find UI images
// @NOTE not needed, our implementation uses the default
br.imagesBaseURL = 'images/';

br.getEmbedCode = function(frameWidth, frameHeight, viewParams) {
    return "Embed code not supported.";
}

br.logoURL = 'https://vault.cca.edu';

//Share modal
br.buildShareDiv = function(jShareDiv) {
    var pageView = document.location + '';
    var bookView = (pageView + '').replace(/#.*/,'');
    var self = this;

    var jForm = $([
        // @TODO could make these nicer, e.g. with Twitter/Facebook share links
        // low priority though because most items will be private to CCA
        '<p>Copy and paste one of these options to share this book elsewhere.</p>',
        '<form method="post" action="">',
            '<fieldset>',
                '<label for="pageview">Link to this page view:</label>',
                '<input type="text" name="pageview" id="pageview" value="' + pageView + '"/>',
            '</fieldset>',
            '<fieldset>',
                '<label for="booklink">Link to the book:</label>',
                '<input type="text" name="booklink" id="booklink" value="' + bookView + '"/>',
            '</fieldset>',

            '<fieldset class="center">',
                '<button type="button" onclick="$.fn.colorbox.close();">Finished</button>',
            '</fieldset>',
        '</form>'].join('\n'));

    jForm.appendTo(jShareDiv);

    jForm.find('input').bind('change', function() {
        var form = $(this).parents('form:first');
        var params = {};
        params.mode = $(form.find('input[name=pages]:checked')).val();
        if (form.find('input[name=thispage]').attr('checked')) {
            params.page = self.getPageNum(self.currentIndex());
        }

        // $$$ changeable width/height to be added to share UI
        var frameWidth = "480px";
        var frameHeight = "430px";
        form.find('.BRframeEmbed').val(self.getEmbedCode(frameWidth, frameHeight, params));
    })
    jForm.find('input[name=thispage]').trigger('change');
    jForm.find('input, textarea').bind('focus', function() {
        this.select();
    });

    jForm.appendTo(jShareDiv);
    jForm = ''; // closure

}


// Override page dimension defaults using first page as model
// page we choose here is arbitrary, we assume all have same aspect ratio
// must put below getPageURI if we want to use that method
var pageOne = br.getPageURI(1);
var img = new Image();
// when image loads, redefine getPage dimension methods
img.onload = function(event) {
    // see HTMLImageElement object: http://www.w3.org/TR/html5/embedded-content-0.html#htmlimageelement
    // these two props *should* be equal for an image not yet insert into DOM
    // but just in case we prefer natural* props
    var w = this.naturalWidth || this.width;
    var h = this.naturalHeight || this.height;

    // define page dimension methods
    // @NOTE might be able to make this work for a book with variable dimensions
    // by using img.src = br.getPageURI(index) inside each method
    // but has tricky async nature since we learn dimensions only inside onload callback
    br.getPageWidth = function(index) {
        return w;
    }
    br.getPageHeight = function(index) {
        return h;
    }

    // we only initialize the Bookreader once we know the dimensions
    br.init();

    // override one single entry in the initUIStrings tooltips method
    $('#BookReader').find('.logo').attr('title', 'Go to VAULT');
    // read-aloud and search need backend components we don't have
    $('#BRtoolbar').find('.read').hide();
    $('#textSrch').hide();
    $('#btnSrch').hide();
}
img.src = pageOne; // this triggers the onload handler above
