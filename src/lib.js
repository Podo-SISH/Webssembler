// ************************************************************************
// Multi Highlight Library
// ************************************************************************


// ****** general functions
function get_tabkey(tabId) {
    return "multi-highlight_" + tabId;
}


// ****** Multi Highlight functions
function hl_search(addedKws, settings, tabinfo) {
    for (var i = 0; i < addedKws.length; i++) {
        chrome.tabs.executeScript(tabinfo.id,
            {
                code: "$(document.body).highlight('" + addedKws[i]
                    + "', {className:'"
                    + settings.CSSprefix1 + " "
                    + (settings.CSSprefix2 + (tabinfo.style_nbr % settings.CSS_COLORS_COUNT)) + " "
                    + (settings.CSSprefix3 + (addedKws[i])) // escape special characters
                    + "'});"
                    + "var " + (addedKws[i])
                    + "= $('." + (settings.CSSprefix3 + (addedKws[i])) + "');"
            }, _ => chrome.runtime.lastError);
        tabinfo.style_nbr += 1;

        hl_dblclick(settings, tabinfo, (settings.CSSprefix3 + (addedKws[i])), (addedKws[i]))
    }
}


function hl_clear(removedKws, settings, tabinfo) {
    // remove in reverse order to avoid removing nested-highlighted-words
    for (var i = removedKws.length - 1; i >= 0; i--) {
        // escape meta-characters, special characters
        className = (settings.CSSprefix3 + (removedKws[i])).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
        chrome.tabs.executeScript(tabinfo.id,
            { code: "$(document.body).unhighlight({className:'" + className + "'})" }, _ => chrome.runtime.lastError);
        tabinfo.style_nbr -= 1;
    }
}


function hl_clearall(settings, tabinfo) {
    chrome.tabs.executeScript(tabinfo.id,
        { code: "$(document.body).unhighlight({className:'" + settings.CSSprefix1 + "'})" }, _ => chrome.runtime.lastError);
}

function hl_dblclick(settings, tabinfo, className, keyword) {
    console.log(className)
    code = 
          "$('." + className + "').dblclick(function(e){"
        + "    position = 0;"
        + "    console.log(" + keyword + ");"
        +      (keyword) + ".each((idx, element) => {"
        + "        if(element == e.target){"
        + "            position = idx;"
        + "        }"
        + "    });"
        + "    chrome.runtime.sendMessage({"
        + "        event: 'dblclick',"
        + "        keyword: $(this).text(),"
        + "        url: window.location.href,"
        + "        title: document.title,"
        + "        position: position"
        + "    });"
        + "});"

    chrome.tabs.executeScript(tabinfo.id,
        {
            code: code
        }, _ => chrome.runtime.lastError
    );
}


function handle_highlightWords_change(tabkey) {
    inputStr = highlightWords.value.toLowerCase();

    chrome.storage.local.get(['settings', tabkey], function (result) {
        var settings = result.settings;
        var tabinfo = result[tabkey];

        // (instant search mode) or (last char of input is delimiter)
        if (settings.isInstant || inputStr.slice(-1) == settings.delim) {
            inputKws = inputStr.split(settings.delim).filter(i => i);
            addedKws = $(inputKws).not(tabinfo.keywords).get(); // get tokens only occur in new input
            removedKws = $(tabinfo.keywords).not(inputKws).get(); // get tokens only occur in old input
            hl_clear(removedKws, settings, tabinfo);
            hl_search(addedKws, settings, tabinfo);
            tabinfo.keywords = inputKws;
            settings.latest_keywords = inputKws;
            chrome.storage.local.set({ [tabkey]: tabinfo, "settings": settings });
        } else if (!inputStr) { // (empty string)
            hl_clearall(settings, tabinfo)
            tabinfo.keywords = [];
            settings.latest_keywords = "";
            chrome.storage.local.set({ [tabkey]: tabinfo, "settings": settings });
        }
    });
}


function handle_delimiter_change(tabkey, settings) {
    chrome.storage.local.get(['settings'], function (result) {
        settings.delim = delimiter.value;
        chrome.storage.local.set({ 'settings': settings }, function () {
            if (tabkey) {
                // reset keywords
                highlightWords.value = "";
                handle_highlightWords_change(tabkey);
            }
        });
    });
}


function handle_instant_mode_change(settings) {
    chrome.storage.local.get(['settings'], function (result) {
        settings.isInstant = $('#instant').is(':checked');
        chrome.storage.local.set({ 'settings': settings });
    });
}


function handle_saveWords_mode_change(settings) {
    chrome.storage.local.get(['settings'], function (result) {
        settings.isSaveKws = $('#saveWords').is(':checked');
        chrome.storage.local.set({ 'settings': settings });
    });
}


function handle_addKw_change(isAddItem) {
    chrome.storage.local.get(['settings'], function (result) {
        if (isAddItem) {
            chrome.contextMenus.create({
                title: 'Add Keyword',
                id: 'addKw', // you'll use this in the handler function to identify this context menu item
                contexts: ['selection'],
            });
            result.settings.isItemAddKw = true;
        } else {
            chrome.contextMenus.remove("addKw");
            result.settings.isItemAddKw = false;
        }

        chrome.storage.local.set({ 'settings': result.settings });
    });
}


function handle_removeKw_change(isAddItem) {
    chrome.storage.local.get(['settings'], function (result) {
        if (isAddItem) {
            chrome.contextMenus.create({
                title: 'Remove Keyword',
                id: 'removeKw', // you'll use this in the handler function to identify this context menu item
                contexts: ['selection'],
            });
            result.settings.isItemRemoveKw = true;
        } else {
            chrome.contextMenus.remove("removeKw");
            result.settings.isItemRemoveKw = false;
        }

        chrome.storage.local.set({ 'settings': result.settings });
    });
}


function handle_popupSize_change(newHeight, newWidth) {
    chrome.storage.local.get(['settings'], function (result) {
        is_changed = false;
        if (newHeight) {
            console.log("newhight:" + newHeight);
            result.settings.popup_height = newHeight;
            is_changed = true;
        }
        if (newWidth) {
            console.log("newWidth:" + newWidth);
            result.settings.popup_width = newWidth;
            is_changed = true;
        }
        if (is_changed) {
            chrome.storage.local.set({ 'settings': result.settings });
        }
    });
}