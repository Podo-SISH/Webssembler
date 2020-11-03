let list_left;
let list_right;
let keywords;

const fields = {
    "position": "페이지 내 키워드",
    "url": "URL",
    "title": "출처",
    "datetime": "일시",
    "keyword": "단어",
}

window.onload = () => {
    list_left = document.querySelector(".list_left");
    list_right = document.querySelector(".list_right");

    let simpledownBtn = document.querySelector(".simpledown");
    let deleteBtn = document.querySelector(".delete");
    let resetBtn = document.querySelector(".reset");

    simpledownBtn.addEventListener("click", () => {
        copyToCliipBoard()
    })

    deleteBtn.addEventListener("click", () => {
        deleteKeyword()
    })

    resetBtn.addEventListener("click", () => {
        let res = confirm("데이터를 초기화 하시겠습니까?")
        if (res) {
            chrome.storage.sync.set({ "keyword": {} })

            list_left.innerHTML = "";
            list_right.innerHTML = "";
        }

    })

    chrome.storage.sync.get("keyword", ({ keyword }) => {
        setKeywords(keyword)
        setKeywordList();
    })
}

function setKeywords(keyword) {
    keywords = keyword;
}

function setKeywordList() {
    words = Object.keys(keywords)
    words.forEach(setKeywordLabel);
}

function setKeywordLabel(keyword, idx) {

    let radio = document.createElement("input")
    radio.setAttribute("class", "keyword_radio")
    radio.setAttribute("type", "radio")
    radio.setAttribute("id", keyword + "check")
    radio.setAttribute("name", "keyword")
    radio.setAttributeNode(document.createAttribute("hidden"))

    list_left.appendChild(radio)


    let wordLabel = document.createElement("label")
    wordLabel.innerText = keyword
    wordLabel.setAttribute("for", keyword + "check")

    list_left.appendChild(wordLabel)


    let keyword_data = document.createElement("div")
    keyword_data.setAttribute("class", "keyword_data " + keyword + "data")

    list_right.appendChild(keyword_data)


    keywords[keyword].forEach((data, dataIdx) => {
        setKeywordData(data, dataIdx)
    });


    wordLabel.addEventListener("click", () => {
        selectKeyword(keyword)
    })


    if (idx == 0) {
        radio.setAttributeNode(document.createAttribute("checked"))
        keyword_data.style.display = "block";
    } else if (idx == -1) {
        radio.setAttributeNode(document.createAttribute("checked"))
        selectKeyword(keyword)
    }
}

function selectKeyword(keyword) {

    document.querySelector("#" + keyword + "check").checked = true

    document.querySelectorAll(".keyword_data").forEach(e => {
        e.style.display = "none"
    });
    document.querySelector("." + keyword + "data").style.display = "block";
}

function setKeywordData(data, dataIdx) {
    let keyword = data.keyword
    let keyword_data = document.querySelector("." + keyword + "data")

    if (dataIdx == -1) {
        selectKeyword(keyword)
        dataIdx = keyword_data.childElementCount
    }

    let dataCon = document.createElement("div")
    dataCon.setAttribute("class", "lr_list")

    labels = ["title", "url", "position", "datetime"]

    let dataVal = document.createElement("label")
    dataVal.setAttribute("class", "dataValue")
    dataVal.setAttribute("for", keyword + dataIdx)

    labels.forEach(key => {

        let label = document.createElement("div")
        switch (key) {

            case "url":
                label.innerHTML = fields[key] + " : "
                let a = document.createElement("a")
                a.innerText = data[key]

                a.addEventListener("click", () => {
                    window.open(data[key])
                })

                label.appendChild(a)

                break

            case "position":
                label.innerText = fields[key] + " : " + data[key] + "번째"
                break

            case "datetime":
                label.innerText = data[key]
                break

            default:
                label.innerText = fields[key] + " : " + data[key]
                break

        }

        dataVal.appendChild(label)
    });

    dataCon.appendChild(dataVal)

    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("id", keyword + dataIdx)
    checkbox.setAttribute("class", "keyword_check")
    checkbox.setAttribute("name", keyword)
    checkbox.setAttribute("value", data.position)

    dataCon.appendChild(checkbox)

    keyword_data.appendChild(dataCon)
}

function copyToCliipBoard() {

    expKeywords = getSelected()

    exp = exportFormat(expKeywords)

    if (exp != "") {
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = exp;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);

        alert("클립보드에 복사되었습니다.")
    } else {
        alert("내보낼 키워드가 없습니다.")
    }
}

function getSelected() {
    checkboxes = document.querySelectorAll(".keyword_check");

    ret = {}

    checkboxes.forEach(box => {
        if (box.checked) {
            keyword = box.name
            idx = keywords[keyword].findIndex((e) => e.position == box.value)
            value = keywords[keyword][idx]

            if (ret[keyword] == null) keywordArr = []
            else keywordArr = ret[keyword]

            keywordArr.push(value)

            ret[keyword] = keywordArr
        }
    });

    return ret
}

function exportFormat(keywords) {
    keys = Object.keys(keywords)
    exp = ""

    keys.forEach(key => {
        exp += key + ' :'
        keyword = keywords[key]

        keyword.sort((a, b) => {
            var aTitle = a.title
            var bTitle = b.title

            if (aTitle > bTitle) {
                return 1
            }
            else if (aTitle < bTitle) {
                return -1
            }
            else {
                if (a.position > b.position) {
                    return 1
                }
                else {
                    return -1
                }
            }
        })

        var idx = 0
        keyword.forEach((element, i) => {

            if (i > 0 && keyword[i - 1].title == element.title) {
                exp += ", " + (element.position) + "번째 키워드";

            } else {
                idx++;

                exp += '\n';
                exp += (idx) + '. ';
                exp += element.title + "(" + element.url + ") | ";
                exp += (element.position) + "번째 키워드";
            }

        });
        exp += '\n\n';
    });

    return exp

}

function deleteKeyword() {
    let selected = getSelected();

    if (Object.keys(selected).length === 0) {
        alert("삭제할 키워드가 없습니다.")
        return
    }

    let res = confirm("정말 삭제하시겠습니까?")

    if (!res) return

    checkboxes = document.querySelectorAll(".keyword_check");

    checkboxes.forEach(box => {
        if (box.checked) {
            keyword = box.name
            let idx = keywords[keyword].findIndex((e) => e.position == box.value)
            keywords[keyword].splice(idx, 1)
        }
    });

    keys = Object.keys(keywords)

    keys.forEach(key => {
        while (1) {
            idx = keywords[key].indexOf(undefined)

            if (idx == -1) break;

            keywords[key].splice(idx, 1)
        }

        if (keywords[key].length === 0) {
            delete keywords[key]
        }

    });

    chrome.storage.sync.set({ "keyword": keywords }, () => {
        list_left.innerHTML = "";
        list_right.innerHTML = "";

        setKeywordList()
    })

    alert("삭제되었습니다.")
    return
}

chrome.runtime.onMessage.addListener(async function (message) {
    if (message.event == "addKeyword") {
        chrome.storage.sync.get("keyword", ({ keyword }) => {
            setKeywords(keyword)

            let data = document.querySelector("." + message.keyword + "data")

            if (data == null) {
                setKeywordLabel(message.keyword, -1)
            } else {
                setKeywordData(message, -1)
            }

        })
    }
})
