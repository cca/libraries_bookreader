/* globals vaultItem */

// split VAULT item title "Book / by Author" into its separate pieces
// for use in the info dialog details
var metadata = [{ label: 'Title', value: vaultItem.title.split(' / ')[0] }]

var author = vaultItem.title.split(' / ')[1] && vaultItem.title
    .split(' / ')[1].replace(/\s*by\s+/i, '').replace(/\.$/, '')
if (author) metadata.push({ label: 'Author', value: author})

metadata.push({
    label: "About the Artists\' Book Collection",
    value: "The Artists' Books Collection was developed to support study and teaching of bookworks as an art form. The collection includes handmade books, published artists' books and special format exhibition catalogs, comics and zines. Titles are <a href='https://library.cca.edu/cgi-bin/koha/opac-search.pl?idx=su&q=artists+books+collection'>searchable in the library catalog</a>."
})


var img = new Image()
// we put all of the Bookreader definition inside this img.onload function
// so that we can use the dimensions of the first page to dynamically define
// the getPageHeight and getPageWidth methods
img.onload = function(event) {
    // see HTMLImageElement object:
    // http://www.w3.org/TR/html5/embedded-content-0.html#htmlimageelement
    // these two props *should* be equal for an image not yet insert into DOM
    // but just in case we prefer natural* props
    var w = this.naturalWidth || this.width
    var h = this.naturalHeight || this.height

    var options = {
        // these are all defaults anyways
        ui: 'full',
        el: '#BookReader',
        enableMobileNav: true,

        mobileNavTitle: vaultItem.title,
        metadata: metadata,

        // EQUELLA magic, 3 thumbnails for each attachment are stored in
        // /file/{{UUID}}/{{VERSION}}/_THUMBS/ with derivative filenames
        // in descending order of size: "_PREVIEW_.jpeg", "_135_.jpeg", ".jpeg"
        thumbnail: vaultItem.url.replace('/items/', '/file/') + '/_THUMBS/' + vaultItem.filenames + '1.JPG_135_.jpeg',

        // Total number of leaves
        getNumLeafs: function () { return vaultItem.pages },
        // Book title & URL used for the book title link
        bookTitle: vaultItem.title,
        bookUrl: vaultItem.url,
        bookUrlMoreInfo: vaultItem.url,
        bookUrlText: vaultItem.title,
        bookUrlTitle: 'View this book in VAULT',

        // retrieve images from VAULT using their index
        getPageURI: function(index) {
            var url = [vaultItem.root, 'file', vaultItem.id, vaultItem.version, vaultItem.filenames + (index + 1) + '.JPG'].join('/')
            return url
        },
        // the whole reason we're inside an img.onload handler
        getPageHeight: function() { return h },
        getPageWidth: function() { return w },

        // Return which side, left or right, a given page should be displayed on
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

        getPageNum: function(index) {
            return index + 1;
        },

        // must define this function to get links in the share dialog
        getEmbedCode: function(frameWidth, frameHeight, viewParams) {
            return "Embed code not supported.";
        },

        // path used to find UI images
        imagesBaseURL: 'images/',
        logoURL: 'https://libraries.cca.edu'
    } // end of options object

    br = new BookReader(options)
    // overwrite this fn (cannot be done with {options})
    // it needs to pass the query string as that's what uniquely identifies
    // a particular book for the app
    br.__proto__._getSocialShareUrl = function() {
        // also fixes the .thispage-social selector which was always false
        if ($('.thispage-social:visible').prop('checked')) {
            // includes hash with page number
            return String(location)
        } else {
            return location.protocol + "//" + location.hostname + location.pathname + location.search;
        }
    };

    br.__proto__.setupTooltips = function() {
        var opts = {
          positions: ['top', 'bottom'],
          shrinkToFit: true,
          spikeGirth: 5,
          spikeLength: 3,
          // $purple
          fill: '#721ea0',
          cornerRadius: 0,
          strokeWidth: 0,
          cssStyles: {
            color: 'white',
            fontSize: '1.25em',
            whiteSpace: 'nowrap'
          }
        }
        $('.js-tooltip').bt(opts)
    };

    br.init()
    // zoom slightly out — Paul's issue with text cut off at top of page
    if (!$.browser.mobile) br.zoom(-1)

    // this says "Go to Archive.org" otherwise
    br.refs.$br.find('.logo').attr('title', 'CCA Libraries Home')

    // ovewrite broken email share link (uses wrong encodeURI function)
    $('.email-share-button').off('click').on('click', function() {
      var body = br.bookTitle + "\n\n" + br._getSocialShareUrl();
      window.location.href = 'mailto:?subject=' + encodeURIComponent(br.bookTitle) + '&body=' + encodeURIComponent(body);
    })
}
 // load first page, triggers the image onload handler
if (vaultItem.id) img.src = [vaultItem.root, 'file', vaultItem.id, vaultItem.version, vaultItem.filenames + '1.JPG'].join('/')
