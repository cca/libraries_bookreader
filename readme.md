# CCA Libraries Bookreader

Interactive bookreader used in VAULT for displaying artist's books. A customized version of [Open Library's Bookreader](https://github.com/openlibrary/bookreader).

## Notes

If you have `npm` you can run `nr demo` to open a sample artist book on a Python server running locally. You will need to be signed into VAULT as an account with permission to see the book in order for images to load.

Some inchoate `grunt` tasks are available:

- `grunt open` opens the localhost demo URL
- `grunt build` minifies JS, CSS, & copies production files in a "dist" directory
