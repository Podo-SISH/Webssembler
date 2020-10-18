// ************************************************************************
// Multi Highlight popup js
// ************************************************************************

document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currTab = tabs[0];
        if (currTab) { // Sanity check
            var tabkey = get_tabkey(currTab.id);
            chrome.storage.local.get(['settings', tabkey], function (result) {
                // fetch general settings
                var settings = result.settings;
                var tabinfo = result[tabkey];
                var flag = { "is_change": false };

                // init popup values
                delimiter.value = settings.delim;
                console.log(tabinfo)
                if (tabinfo.isNewPage) { // decide which keywords to fill in
                    flag.is_change = true;
                    highlightWords.value = settings.latest_keywords.join(settings.delim);
                } else {
                    highlightWords.value = tabinfo.keywords.join(settings.delim);
                }
                highlightWords.value += highlightWords.value ? settings.delim : "";
                tabinfo.isNewPage = false;
                chrome.storage.local.set({ [tabkey]: tabinfo }, function () {
                    if (flag.is_change) {
                        handle_highlightWords_change(tabkey);
                    }
                });


                // register listener
                $("#delimiter").on("input", function () {
                    handle_delimiter_change(tabkey, settings);
                })
                $("#highlightWords").on("input", function () {
                    handle_highlightWords_change(tabkey);
                })
                $("#instant").on("input", function () {
                    handle_instant_mode_change(settings);
                })
                $("#saveWords").on("input", function () {
                    handle_saveWords_mode_change(settings);
                })

            });
        }
    });
});