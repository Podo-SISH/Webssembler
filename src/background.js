chrome.runtime.onInstalled.addListener(function (details) {
    // initialize variables
    var settings = {
        // CSS settings
        CSS_COLORS_COUNT: 10, // number of available highlight colors
        CSSprefix1: "chrome-extension-FindManyStrings",
        CSSprefix2: "chrome-extension-FindManyStrings-style-",
        CSSprefix3: "CE-FMS-",

        // search settings
        isInstant: true,
        isSaveKws: true,
        delim: ' ',
        latest_keywords: [],

        // context menu settings
        isItemAddKw: true,
        isItemRemoveKw: true
    }

    // add context menu item
    chrome.contextMenus.create({
        title: 'Remove Keyword',
        id: 'removeKw', // you'll use this in the handler function to identify this context menu item
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        title: 'Add Keyword',
        id: 'addKw', // you'll use this in the handler function to identify this context menu item
        contexts: ['selection'],
    });

    chrome.storage.local.set({ 'settings': settings });
});

// handle new page opened
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        var tabkey = get_tabkey(tabId);
        var tabinfo = {};
        tabinfo.id = tabId;
        tabinfo.style_nbr = 0;
        tabinfo.isNewPage = true;
        tabinfo.keywords = [];
        chrome.storage.local.set({ [tabkey]: tabinfo });
    }
});

// handle context menu item
chrome.contextMenus.onClicked.addListener(function getword(info, tab) {
    var tabkey = get_tabkey(tab.id);
    var kw = info.selectionText.toLowerCase().split(' ')[0];

    if (info.menuItemId === "removeKw") {
        chrome.storage.local.get(["settings", tabkey], function (result) {
            // init
            settings = result.settings;
            tabinfo = result[tabkey];
            // check existence
            var index = tabinfo.keywords.indexOf(kw);
            if (index !== -1) {
                length = tabinfo.keywords.length
                // check if any keywords is a substring of kw
                while (length--) {
                    if (kw.indexOf(tabinfo.keywords[length]) != -1 && length != index) {
                        return;
                    }
                }
                tabinfo.keywords.splice(index, 1);
            }
            settings.latest_keywords = tabinfo.keywords;
            hl_clear([kw], settings, tabinfo);
            chrome.storage.local.set({ [tabkey]: tabinfo, "settings": settings }, function () {
            });
        });
    } else if (info.menuItemId === "addKw") {
        chrome.storage.local.get(["settings", tabkey], function (result) {
            // init
            settings = result.settings;
            tabinfo = result[tabkey];
            tabinfo.keywords.push(kw);
            settings.latest_keywords = tabinfo.keywords;
            hl_search([kw], settings, tabinfo);
            chrome.storage.local.set({ [tabkey]: tabinfo, "settings": settings }, function () {
            });
        });
    }

});

chrome.runtime.onMessage.addListener(async function (message) {
    if (message.event == "dblclick") {

        delete (message.event)

        var today = new Date
        message.datetime = today.toLocaleString()


        // console.log("background.js / dblclick messageListen : ")
        // console.log(message)

        save_keyword_on_sync(message.keyword, message)
    }
})

// 키워드 저장, 근데 중복되는 키워드도 다 저장함.
// 유니크 키를 하나 정해서 중복 제거 해야함
async function save_keyword_on_sync(keyword, value) {
    await chrome.storage.sync.get("keyword", function (result) {

        storage = result.keyword
        // storage = {}

        if (storage == null) storage = {}

        if (storage[keyword] == null) keywordArr = []
        else keywordArr = storage[keyword]

        for (i = 0; i < keywordArr.length; i++) {
            if (keywordArr[i].url == value.url && keywordArr[i].position == value.position) {
                alert_to_tab("이미 저장된 키워드입니다.")

                return
            }
        };

        keywordArr.push(value)

        storage[keyword] = keywordArr


        chrome.storage.sync.set({ "keyword": storage }, function () {
            console.log('Value is set to ');
            console.log(storage)

            alert_to_tab("키워드가 저장되었습니다. [" + keyword + "]")
        });
    });
}


function alert_to_tab(message) {
    code = "alert('" + message + "');"

    chrome.tabs.executeScript(null,
        {
            code: code
        }, _ => chrome.runtime.lastError);
}
