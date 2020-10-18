window.onload = function(){
    let menubar = document.querySelector(".menubar");
    let menus = document.querySelector(".menus");

    let menuflag = 1;

    menubar.addEventListener("click", ()=>{
        if(menuflag == 0) {
            menus.style.width = "0px";
            menuflag = 1;
        }else {
            menus.style.width = "130px";
            menuflag = 0;
        }
    })
    
    let con_iframe = document.querySelector(".con_iframe");

    let multi_highlight = document.querySelector(".multi_highlight");
    let save_keyword = document.querySelector(".save_keyword");
    let screen_capture = document.querySelector(".screen_capture");
    let save_list = document.querySelector(".save_list");

    let main = document.querySelector(".main");
    let con_menus = document.querySelector(".con_menus");

    let on = document.querySelector(".on");
    let off = document.querySelector(".off");

    function changesize(){
        main.style.width = "340px";
        main.style.height = "240px";
        con_menus.style.height = "200px";
    }

    multi_highlight.addEventListener("click", ()=>{
        changesize();
        con_iframe.src = "subpage/multi_highlight.html";
    })

    let save_keywordflag = 1;

    save_keyword.addEventListener("click", ()=>{
        if(save_keywordflag == 0) {
            save_keyword.style.backgroundColor = "rgb(32, 115, 224)";
            on.style.display = "none";
            off.style.display = "inline-block";
            save_keywordflag = 1;
        }else {
            save_keyword.style.backgroundColor = "#629DE9";
            on.style.display = "inline-block";
            off.style.display = "none";
            save_keywordflag = 0;
        }
    })

    screen_capture.addEventListener("click", ()=>{
        changesize();
        con_iframe.src = "screen_capture.html";
    })

    save_list.addEventListener("click", ()=>{
        main.style.width = "630px";
        main.style.height = "400px";
        con_menus.style.height = "360px";
        con_iframe.src = "save_list.html";
    })
}