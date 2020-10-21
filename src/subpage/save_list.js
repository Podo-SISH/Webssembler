window.onload = ()=>{
    let list_right = document.querySelector(".list_right");

    let keyword_1 = document.querySelector(".keyword_1");
    let keyword_2 = document.querySelector(".keyword_2");
    let keyword_3 = document.querySelector(".keyword_3");

    let keyword1_list = document.querySelector(".keyword1_list");
    let keyword2_list = document.querySelector(".keyword2_list");
    let keyword3_list = document.querySelector(".keyword3_list");

    let keyword_list = document.querySelectorAll(".list_right > div");
    let i=0;
    // for(i=0; i<keyword_list.length-1; i++) {

    //     keyword_1.addEventListener("click", ()=>{
    //         keyword_list[i].style.display = "none";
    //         keyword1_list.style.display = "block";
    //     })
    
    //     keyword_2.addEventListener("click", ()=>{
    
    //     })
    
    //     keyword_3.addEventListener("click", ()=>{
    
    //     })

    // }

    keyword_1.addEventListener("click", ()=>{
        for(i=0; i<keyword_list.length-1; i++) {
            keyword_list[i].style.display = "none";
        }
        keyword1_list.style.display = "block";
    })

    keyword_2.addEventListener("click", ()=>{
        for(i=0; i<keyword_list.length-1; i++) {
            keyword_list[i].style.display = "none";
        }
        keyword2_list.style.display = "block";
    })

    keyword_3.addEventListener("click", ()=>{
        for(i=0; i<keyword_list.length-1; i++) {
            keyword_list[i].style.display = "none";
        }
        keyword3_list.style.display = "block";
    })
    
}