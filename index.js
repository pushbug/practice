const input = document.getElementById("inputBox");
let showTextEN;
let showTextTH;
let allSentence;
let scoreTyping = 0;
let checkSentence;
let dataArray;

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {

    const jsonData = data; 
    dataArray = Object.values(jsonData);

    allSentence = dataArray.length;

    let num = randomSentence();

    showTextEN = dataArray[num].English;
    showTextTH = dataArray[num].Thai;

    document.getElementById('showTextEN').innerHTML = showTextEN;
    document.getElementById('showTextTH').innerHTML = showTextTH;
    
    input.addEventListener("keyup", (event) => {
        if(input.value.includes(showTextEN) && input.value !== checkSentence){

            input.classList.remove("empty");
            input.classList.remove("not-match");
            input.classList.add("match");

            if(event.key === "Enter"){
                checkSentence = showTextEN;            
                scoreTyping ++;
                document.getElementById('scoreTyping').innerHTML = scoreTyping;

                num = randomSentence();

                showTextEN = dataArray[num].English;
                showTextTH = dataArray[num].Thai;
            
                document.getElementById('showTextEN').innerHTML = showTextEN;
                document.getElementById('showTextTH').innerHTML = showTextTH;

                input.value = "";
                input.classList.remove("match");
                input.classList.remove("not-match");
                input.classList.add("empty");
            }
    
        } else if (input.value.trim() === ""){
                input.classList.remove("match");
                input.classList.remove("not-match");
                input.classList.add("empty");
        } else {
                input.classList.remove("empty");
                input.classList.remove("match");
                input.classList.add("not-match");
        }     

    });

});

function randomSentence(){
    const randomIndex = Math.floor(Math.random() * allSentence);
    checkSentence = "";
    return randomIndex;
}