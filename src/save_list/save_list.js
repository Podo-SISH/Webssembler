let list_left;
let list_right;

const fields = {
    "position": "페이지 내 키워드 위치값",
    "url": "URL",
    "title": "출처",
    "datetime": "일시",
    "keyword": "단어",
}

window.onload = () => {

    list_left = document.querySelector(".list_left");
    list_right = document.querySelector(".list_right");

    let simpledownBtn = document.querySelector(".simpledown");
    let changeBtn = document.querySelector(".change");
    let deleteBtn = document.querySelector(".delete");
    let resetBtn = document.querySelector(".reset");

    simpledownBtn.addEventListener("click", () => {
        chrome.storage.sync.get("keyword", ({ keyword }) => {
            copyToCliipBoard(keyword)
        })
    })


    changeBtn.addEventListener("click", () => {

    })


    deleteBtn.addEventListener("click", () => {

    })

    resetBtn.addEventListener("click", () => {
        chrome.storage.sync.set({ "keyword": {} })

        alert("데이터가 초기화 되었습니다.")
    })


    chrome.storage.sync.get("keyword", ({ keyword }) => {
        setKeyowrdList(keyword)
    })
}

function setKeyowrdList(keywords) {
    words = Object.keys(keywords)
    words.forEach((keyword, idx) => {
        let radio = document.createElement("input")
        radio.setAttribute("class", "keyword_radio")
        radio.setAttribute("type", "radio")
        radio.setAttribute("id", keyword + "check")
        radio.setAttribute("name", "keyword")
        radio.setAttributeNode(document.createAttribute("hidden"))

        list_left.appendChild(radio)


        let wordLabel = document.createElement("label")
        wordLabel.innerText = keyword
        wordLabel.id = keyword
        wordLabel.setAttribute("for", keyword + "check")

        list_left.appendChild(wordLabel)


        let keyword_data = document.createElement("div")
        keyword_data.setAttribute("class", "keyword_data")

        list_right.appendChild(keyword_data)


        keywords[keyword].forEach((data, dataIdx) => {
            let dataCon = document.createElement("div")
            dataCon.setAttribute("class", "lr_list")

            labels = ["title", "url", "position", "datetime"]

            labels.forEach(key => {
                let t = document.createElement("div")


                let label = document.createElement("label")
                label.innerText = fields[key] + " : " + data[key]
                label.id = keyword
                label.setAttribute("for", keyword + dataIdx + key)

                t.appendChild(label)


                let checkbox = document.createElement("input")
                checkbox.setAttribute("type", "checkbox")
                checkbox.setAttribute("id", keyword + dataIdx + key)

                t.appendChild(checkbox)


                dataCon.appendChild(t)
            });

            keyword_data.appendChild(dataCon)
        });


        wordLabel.addEventListener("click", () => {
            document.querySelectorAll(".keyword_data").forEach(e => {
                e.style.display = "none"
            });
            keyword_data.style.display = "block";
        })


        if (idx == 0) {
            radio.setAttributeNode(document.createAttribute("checked"))
            keyword_data.style.display = "block";
        }
    });
}

function copyToCliipBoard(keywords) {

    // exp = JSON.stringify(keywords, null, ' ')

    exp = exportFormat(keywords)
    // 우리가 원하는 export 포맷으로 string 변환하는 함수 필요

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