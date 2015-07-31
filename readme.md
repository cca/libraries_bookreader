# CCA Libraries Bookreader

Interactive bookreader used in [VAULT](https://vault.cca.edu) for displaying artist's books. A customized version of [Open Library's Bookreader](https://github.com/openlibrary/bookreader).

## Development Notes

If you have `npm` you can run `npm run demo` to open a sample artist book on a Python server running locally. You will need to be signed into VAULT as an account with permission to see the book in order for images to load.

Some inchoate `grunt` tasks are available:

- `grunt open` opens the localhost demo URL
- `grunt build` minifies JS, CSS, & copies production files in a "dist" directory

Our Customizations live primarily in the js/app.js file, which is based off of bookreader/BookReaderDemo/BookReaderJSSimple.js, and css/styles.css.

## VAULT & File URLs

VAULT interacts with the bookreader by constructing special links filled with item metadata that tell the bookreader how to render a particular item's attachments as a book. Here's an example:

{{book.reader.domain}}/?_title_=**Awesome%20Book**&_id_=**d79ea3fb-6d87-4003-9b40-9b322dcd87fc**&_version_=**1**&_filenames_=**page**&_pages_=**9**

I've made the _keys_ italics in the query string and their **values** bold to highlight what information is passed. Here are the meanings of these fields and how the bookreader uses them:

- **title** is used to render a link in the upper left & set the `<title>` of the page
- **id** is the VAULT item's UUID
- **version** is the VAULT item's version
- **filenames** are the filename prefixes in front of each page number, e.g. for files like "page1.jpg" they would be "page"
- **pages** is the number of pages (indexed from 1, not 0)

Most of these pieces of information are used to determine what VAULT file URL corresponds to which book page number. The information is parsed out of the URL's query string and serialized in a global `vaultItem` object which app.js then uses to set certain configurations for the Open Library Bookreader.

## Links

- [Internet Archive Bookreader documentation](https://openlibrary.org/dev/docs/bookreader)
- [CCA Color Values](https://sites.google.com/a/cca.edu/libraries/home/design/color-values) (libraries only)
- [CCA Libraries Logos](https://sites.google.com/a/cca.edu/libraries/home/design/logos) (libraries only)
