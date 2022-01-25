# CCA Libraries Bookreader

Interactive bookreader used in [VAULT](https://vault.cca.edu) for displaying artist's books. A customized version of [Internet Archive's Bookreader](https://github.com/internetarchive/bookreader). The version in package.json of this project is meant to track the version of IA's bookreader we're using.

## Development Notes

If you have `npm` you can run `npm run demo` to open a sample artist book on a local web server.

Two `grunt` tasks are available:

- `grunt build` minifies JS, CSS, & copies production files in a "dist" directory
- `grunt watch` watches the JS, CSS, & index.html files for changes & then builds

Our Customizations live primarily in the js/app.js file, which is based off of bookreader/BookReaderDemo/BookReaderJSAdvanced.js, and in the SCSS files in the "css" directory.

## Publishing changes

We host the app [on VAULT](https://vault.cca.edu/items/79e553bc-a84c-4610-b6d7-190a90dbb268/1/) to avoid problems with CORS (cross-origin resource restrictions, VAULT content being unable to be loaded on other domains). To publish code changes:

- run the included `./publi.sh` script to build the app, zip it up, & open the VAULT item
- login to VAULT if need be
- **edit this version** under the Actions menu
- **delete** the previous attachment zip
- upload the new attachment zip
- **edit** the attachment
- click the **Unzip files** button
- **save** in attachments dialog
- **save** the item

To test, you do the same with a different item and then edit that item's URL into the artists' books item template (under the Libraries eResources collection in the equella_templates project).

## VAULT & File URLs

VAULT interacts with the Bookreader by constructing special links filled with item metadata that tell the Bookreader how to render a particular item's attachments as a book. Here's an example:

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
- [CCA Color Values](https://sites.google.com/cca.edu/librarieswiki/home/design/color-values) (libraries only)
