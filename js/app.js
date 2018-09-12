var vault_url = vaultItem.root + 'items/' + vaultItem.id + '/' + vaultItem.version + '/'
// Override page dimension defaults using first page as model
// page we choose here is arbitrary, we assume all have same aspect ratio
// must put below getPageURI if we want to use that method
var pageOne = vaultItem.root + 'file/' + vaultItem.id + '/' + vaultItem.version + '/' + vaultItem.filenames + '1.JPG';
var img = new Image();
// when image loads, redefine getPage dimension methods
img.onload = function(event) {
    // see HTMLImageElement object: http://www.w3.org/TR/html5/embedded-content-0.html#htmlimageelement
    // these two props *should* be equal for an image not yet insert into DOM
    // but just in case we prefer natural* props
    var w = this.naturalWidth || this.width;
    var h = this.naturalHeight || this.height;

    var options = {
        ui: 'full',
        el: '#BookReader',
        enableMobileNav: true,
        mobileNavTitle: vaultItem.title,
        metadata: [
            { label: 'Title', value: vaultItem.title.split(' / ')[0] },
            { label: 'Author', value: vaultItem.title.split(' / ')[1].replace(/\s*by\s+/i, '').replace(/\.$/, '') }
        ],
        thumbnail: vault_url.replace('/items/', '/thumbs/') + '?gallery=preview',
        bookUrlMoreInfo: vault_url,

        // Total number of leafs
        getNumLeafs: function () { return vaultItem.pages },
        // Book title & URL used for the book title link
        bookTitle: vaultItem.title,
        bookUrl: vault_url,

        // We load the images from archive.org -- you can modify this function to retrieve images
        // using a different URL structure
        getPageURI: function(index, reduce, rotate) {
            // reduce and rotate are ignored in this simple implementation, but we
            // could e.g. look at reduce and load images from a different directory
            // or pass the information to an image server
            var url = vaultItem.root + 'file/' + vaultItem.id + '/' + vaultItem.version + '/' + vaultItem.filenames + (index + 1) + '.JPG';
            return url;
        },
        getPageHeight: function() { return h },
        getPageWidth: function() { return w },

        // Return which side, left or right, that a given page should be displayed on
        getPageSide: function(index) {
            if (0 === (index & 0x1)) {
                return 'R';
            } else {
                return 'L';
            }
        },

        // This function returns the left and right indices for the user-visible
        // spread that contains the given index.  The return values may be
        // null if there is no facing page or the index is invalid.
        getSpreadIndices: function(pindex) {
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
        },

        // For a given "accessible page index" return the page number in the book.
        // For example, index 5 might correspond to "Page 1" if there is front matter such
        // as a title page and table of contents.
        getPageNum: function(index) {
            return index + 1;
        },

        // path used to find UI images
        imagesBaseURL: 'images/',

        getEmbedCode: function(frameWidth, frameHeight, viewParams) {
            return "Embed code not supported.";
        },

        logoURL: 'https://vault.cca.edu',
    } // end of options object

    br = new BookReader(options)
    br.init();
    // zoom slightly out — Paul's issue with text cut off at top of page
    br.zoom(-1);

    // override an entry in the initUIStrings tooltips method
    $('#BookReader').find('.logo').attr('title', 'Go to VAULT');
}
img.src = pageOne; // triggers the image onload handler
