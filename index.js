const input = document.getElementById("inputBox");
let showTextEN;
let showTextTH;
let allSentence;
let winScore = 0;
let loseScore = 0;
let dataArray;
let enterPress = 0;


fetch('data.json')
    .then((response) => response.json())
    .then((data) => {

        const jsonData = data; 
        dataArray = Object.values(jsonData);

        allSentence = dataArray.length;

        let num = randomSentence();

        newSentence(num);

        input.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                enterPress ++;
                if(enterPress === 1){
                    //alert("1 enter");
                    var inputBox = document.getElementById("inputBox").value;
        
                    if(inputBox === showTextEN){  
                        winScore ++;
                        document.getElementById('winScore').innerHTML = winScore;
                        document.getElementById('showTextEN').innerHTML = showTextEN;
                        sentenceRight();
                    }else {
                        loseScore ++;
                        document.getElementById('loseScore').innerHTML = loseScore;
                        document.getElementById('showTextEN').innerHTML = showTextEN;
                        sentenceWrong();
                    }

                }else if(enterPress === 2){
                    //alert("2 ensters");
                    num = randomSentence();
                    newSentence(num);
                    input.value = "";
                    sentenceNormal();
                    enterPress = 0;
                }
            }
        });

});

function newSentence(num){
    showTextEN = dataArray[num].English;
    showTextTH = dataArray[num].Thai;

    document.getElementById('showTextTH').innerHTML = showTextTH;
    document.getElementById('showTextEN').innerHTML = "-";

    sentenceNormal();
}


function randomSentence(){
    const randomIndex = Math.floor(Math.random() * allSentence);
    return randomIndex;
}


function sentenceNormal() {
    var element = document.getElementById("showTextEN");
    var inputAnswer = document.getElementById("inputBox");

    element.classList.add("sentenceNormal");
    element.classList.remove("sentenceRight");
    inputAnswer.classList.remove("inputRight");
    inputAnswer.classList.remove("inputWrong");
}

function sentenceRight() {
    var element = document.getElementById("showTextEN");
    var inputAnswer = document.getElementById("inputBox");

    element.classList.add("sentenceRight");
    inputAnswer.classList.add("inputRight");
}

function sentenceWrong() {
    var element = document.getElementById("showTextEN");
    var inputAnswer = document.getElementById("inputBox");

    element.classList.add("sentenceRight");
    inputAnswer.classList.add("inputWrong");
}
