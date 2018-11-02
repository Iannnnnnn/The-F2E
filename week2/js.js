    const api = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
    let AllAttractions=[];
    //篩選結果列表
    let matcharea = [];
    let matchcost = [];
    let matchopentime = [];
    let matchword = [];

    //透過api取資料
    fetch(api,{method:'Get'})
        .then(rsp=>rsp.json())
        .then(data=>{
            //抓資料
            AllAttractions=data["result"]["records"];
            // 取得所有區域
            getZone(AllAttractions);
            //顯示搜尋結果
            getinfornation(AllAttractions);
            matcharea = AllAttractions;
            matchcost = AllAttractions;
            matchopentime = AllAttractions;
            matchword = AllAttractions; 
        }); 
    
    

    //動態取得區域、加入選項
    const zonelist = document.getElementById("zonelist");
    function getZone(AllAttractions){
        let str=zonelist.innerHTML; 
        //抓出所有區域
        match = AllAttractions.map(item=>Object.values(item)[1]);
        //利用filter去除重複項目
        matchlist = match.filter(function (el,i,arr){
            return arr.indexOf(el)===i;
        });
        //Html 
        for(let i=0;i<matchlist.length;i++){
            str=str+`
            <option value="${matchlist[i]}">${matchlist[i]}</option>
            `
        }
        //渲染頁面
        zonelist.innerHTML=str;
    }

    


    //地區篩選
    zonelist.addEventListener("click",function getvalue(){
        // console.log(zonelist.value);
        zone = zonelist.value;
        if(zonelist.value === ""){
            matcharea = AllAttractions;
            // getinfornation(AllAttractions);
            finallist(matcharea,matchcost,matchopentime,matchword);
        }
        else{
            areafilter(AllAttractions);
        }
    });
    function areafilter(AllAttractions){
        matcharea = AllAttractions.filter( Attraction => Object.values(Attraction)[1] === zonelist.value);
        // console.log("matcharea :"+matcharea);
        finallist(matcharea,matchcost,matchopentime,matchword);
    } 

    // tag篩選
    let tagcost = document.getElementsByClassName('tag')[0];
    let tagopen = document.getElementsByClassName('tag')[1];
    tagcost.addEventListener('click',function(){
        // console.log(tagcost);
        if(!tagcost.classList.contains('active')){ costfilter(AllAttractions,tagcost.innerText); }
        else{ costfilter(AllAttractions,""); }
        tagcost.classList.toggle('active');
    })
    tagopen.addEventListener('click',function(){
        if(!tagopen.classList.contains('active')){ opentimefilter(AllAttractions,tagopen.innerText);}
        else{ opentimefilter(AllAttractions,"") }
        tagopen.classList.toggle('active');  
    })

    function opentimefilter(AllAttractions,tag){
        if(tag ==="全天候開放"){
            matchopentime = AllAttractions.filter( function(el){
                return Object.values(el)[9]===tag;
            });
        }
        else { matchopentime =AllAttractions };
        // console.log("matchopentime :" + matchopentime);
        finallist(matcharea,matchcost,matchopentime,matchword);
        
    }

    function costfilter(AllAttractions,tag){
        if(tag ==="免費參觀"){
            matchcost = AllAttractions.filter( function(el){
                return Object.values(el)[0]===tag;
            });   
        }
        else{ matchcost = AllAttractions};
        finallist(matcharea,matchcost,matchopentime,matchword);
    }
    //上方搜尋列篩選
    const topseachbar = document.getElementById('search');
    let searchword = "";
    topseachbar.addEventListener('input', function getsearchword(){
        searchword = topseachbar.value;
        searchfilter(AllAttractions,searchword);
    });
    
    function searchfilter(AllAttractions,searchword){
        matchword = AllAttractions.filter( Attraction => Object.values(Attraction)[14].indexOf(searchword) != -1 );
        finallist(matcharea,matchcost,matchopentime,matchword);
    };   

    //整合篩選
    function finallist(matcharea,matchcost,matchopentime,matchword){

        //轉換成ip來進行篩選
        let areaiplist =matcharea.map(item=>item._id);
        let costiplist =matchcost.map(item=>item._id);
        let openiplist =matchopentime.map(item=>item._id);
        let wordiplist =matchword.map(item=>item._id);

        let list1 = areaiplist.filter(function(el){
            return costiplist.indexOf(el) >-1;
        });
        let list2 = openiplist.filter(function(el){
            return wordiplist.indexOf(el) >-1;
        });
        let iplist = list1.filter(function(el){
            return list2.indexOf(el)>-1;
        });
        // console.log(iplist);

        let itemlist = AllAttractions.filter(function(el){
            if(iplist.indexOf(Object.values(el)[22]) >-1 ) return true; 
        });

        // console.log(matcharea.length,matchcost.length,matchopentime.length,matchword.length );
        getinfornation(itemlist);
    }

    //showlist
    let item = document.getElementsByClassName('list')[0];
    let length = 0;
    function getinfornation(AllAttractions){
        let itemHTML = item.innerHTML;
        itemHTML = "";
        let length = AllAttractions.length;
        for(let i=0;i<length;i++){
            let imgurl = Object.values(AllAttractions[i])[16];
            let name = Object.values(AllAttractions[i])[14];
            let introduction = Object.values(AllAttractions[i])[10];
            let area = Object.values(AllAttractions[i])[1];
            let address = Object.values(AllAttractions[i])[4];
            let opentime = Object.values(AllAttractions[i])[9];
            itemHTML = itemHTML + `
            <div class="item">
                <div class="img">
                    <img src="${imgurl}" alt="">
                </div>
                <div class="introduction">
                    <p class="subtitle">${name}</p>
                    <p class="narrative">${introduction}</p>
                    <p class="area bold ">${area}</p>
                    
                    <div>
                        <span class="color-gray font-sm"><i class="fas fa-map-marker-alt"></i>${address}</span>
                        <span class="color-gray font-sm"><i class="fas fa-calendar-alt"></i>${opentime}</span>
                    </div>    
                </div>
            </div>
            `;

        }
        item.innerHTML = itemHTML;
        let total = document.getElementsByClassName('item');
        let number = document.getElementsByClassName('shownumber');
        number[0].textContent = total.length;
        // console.log("total.length :" + total.length);
        
    }





