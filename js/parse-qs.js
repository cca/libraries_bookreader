function parseQuery(str) {
    var out = {
        root: 'https://vault.cca.edu'
    };
    ['id', 'filenames', 'pages', 'title', 'version'].forEach(function(item) {
        out[item] = $.query.get(item)
    })

    // construct VAULT URL from pieces above
    out.url = [out.root, 'items', out.id, out.version].join('/')

    return out
}

window.vaultItem = parseQuery(location.search)
