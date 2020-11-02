window.onload = function () {
    let menubar = document.querySelector(".menubar");
    let menus = document.querySelector(".menus");

    let menuflag = 1;

    menubar.addEventListener("click", () => {
        if (menuflag == 0) {
            menus.style.width = "0px";
            menuflag = 1;
        } else {
            menus.style.width = "130px";
            menuflag = 0;
        }
    })

    let con_iframe = document.querySelector(".con_iframe");

    let multi_highlight = document.querySelector(".multi_highlight");
    let save_list = document.querySelector(".save_list");

    let main = document.querySelector(".main");
    let con_menus = document.querySelector(".con_menus");

    let on = document.querySelector(".on");
    let off = document.querySelector(".off");

    function changesize() {
        main.style.width = "340px";
        main.style.height = "240px";
        con_menus.style.height = "200px";
    }

    multi_highlight.addEventListener("click", () => {
        changesize();
        con_iframe.src = "multi_highlight/multi_highlight.html";
    })

    save_list.addEventListener("click", () => {
        main.style.width = "500px";
        main.style.height = "300px";
        con_menus.style.height = "300px";
        con_iframe.src = "save_list/save_list.html";
    })
}