function parseQuery(str) {
    var out = {
        root: 'https://vault.cca.edu/'
    };
    ['id', 'filenames', 'pages', 'title', 'version'].forEach(function(item) {
        out[item] = $.query.get(item)
    })

    return out
}

window.vaultItem = parseQuery(location.search)
console.log(vaultItem)
