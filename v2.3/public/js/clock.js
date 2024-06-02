/* Hour Toggle Format */
const formatSwitchBtn = document.querySelector(".format-switch-btn");

formatSwitchBtn.addEventListener("click", ()=> {
    formatSwitchBtn.classList.toggle("active")

    var formatValue = formatSwitchBtn.getAttribute("data-format");
    
    if(formatValue === "12"){
        formatSwitchBtn.setAttribute("data-format", "24");
    }else{
        formatSwitchBtn.setAttribute("data-format", "12");
    }

});

/* CLock Display */
let clock = setInterval(()=>{
    let newDate = new Date();
    let hr = newDate.getHours();
    let min = newDate.getMinutes();
    let sec = newDate.getSeconds();
    let period = "";
    var formatValue = formatSwitchBtn.getAttribute("data-format");

    if(formatValue === "12"){
        
        if(hr >= 12){
            period = "pm";
        }else{
            period = "am"
        }

        hr  = hr  > 12 ? hr  % 12 : hr ;
    }

    document.getElementById("hours").innerHTML = getRealNm(hr);
    document.getElementById("minutes").innerHTML = getRealNm(min);
    document.getElementById("seconds").innerHTML = getRealNm(sec);
    document.getElementById("time-period").innerHTML = period;

});

const getRealNm = (Nm) =>{
    if(Nm>9){
        return Nm;
    }else{
        return '0' + Nm
    }
}

/* Current Date Display */
var today = new Date();
const day = today.getDate();
const year = today.getFullYear();
const weekDay = today.toLocaleString("default",{weekday: "long"});
const month = today.toLocaleString("default",{month: "short"});
console.log("today:" + today + 
            "\nday:" + day + 
            "\nyear:" + year + 
            "\nweekDay:" + weekDay + 
            "\nmonth:" + month
);
document.getElementById("current-month").innerHTML = month;
document.getElementById("current-week-day").innerHTML = weekDay;
document.getElementById("current-year").innerHTML = year;
document.getElementById("current-day").innerHTML = day;

