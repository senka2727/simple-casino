//Основные элементы
const reels = document.querySelectorAll(".Reel");
const spinButton = document.getElementById("SpinButton");

//Основная логика
const symbolHeight = 145;
let position = 0;
let speed = 100; //Скорость вращения
let spinning = false;

let reelStopped = new Array(reels.length).fill(false);

//Экономика
let CurrentBalance = 100000;
let CurrentBet = 500;
const CurrentBalanceText = document.getElementById("CurrentBalanceText");
const CurrentBetText = document.getElementById("CurrentBetText");

const addCurrentBetButton = document.getElementById("AddCurrentBetButton");
const decCurrentBetButton = document.getElementById("DecCurrentBetButton");
const maxCurrentBetButton = document.getElementById("MaxBetButton");

let CurrentSymbols = new Array(3).fill(0);

function loop() {
  if(spinning){
    position += speed;

    if(position >= symbolHeight){
      position -= symbolHeight;
      for(let i = 0; i < reels.length; i++) {
        if(reelStopped[i] === false) reels[i].append(reels[i].children[0]);
      }
    }

    for(let i = 0; i < reels.length; i++) {
        if(reelStopped[i] === false) reels[i].style.top = -position + "px";
    }
  }

  requestAnimationFrame(loop);
}

loop();

function StopReelOnSymbol(ReelID, SymbolID) { //ReelID, SymbolID
  reelStopped[ReelID] = true;
  while(reels[ReelID].children[0].classList.contains(SymbolID) == false){
    reels[ReelID].append(reels[ReelID].children[0]);
  }
  reels[ReelID].style.top = symbolHeight / 2 + "px";

  if(ReelID == 2) EndGame();
}

function SetGame(Symbols, Delays){
  for(let i = 0; i < reels.length; i++){
      setTimeout(() => {StopReelOnSymbol(i, Symbols[i])}, Delays[i] * 1000);
  }
}

function EndGame(){
  spinning = false; //глобальная остановка прокрутки и активация кнопки spin 

  let totalSymbols = CurrentSymbols[0].toString() + CurrentSymbols[1].toString() + CurrentSymbols[2].toString(); //подсчет выигрыша
  switch(totalSymbols){
    case "000":
      CurrentBalance += CurrentBet * 2;
      break;
    case "111":
      CurrentBalance += CurrentBet * 3;
      break;
    case "222":
      CurrentBalance += CurrentBet * 10;
      break;
  }

  UpdateUI();
}

//Пока нет серверной части
function GenerateRandomSymbol(){
  return Math.floor(Math.random() * 3);
}

function GenerateRandomDelay(PreviousDelay){
  return (Math.floor(Math.random() * 3) + 0.5 + PreviousDelay);
}
//----------------

function UpdateUI(){
  CurrentBetText.innerHTML = "bet " + CurrentBet;
  CurrentBalanceText.innerHTML = "Balance: " + CurrentBalance;

}

UpdateUI(); //Чтобы сразу апдейнуть юай на реальные значения

spinButton.onclick = () => {
  if(spinning) return;
  if(CurrentBalance - CurrentBet < 0) return;

  CurrentBalance -= CurrentBet;
  UpdateUI();

  spinning = true;

  reelStopped.fill(false);
  
  let Delays = new Array(reels.length).fill(0); //генерация делеев
  Delays[0] = GenerateRandomDelay(0);
  for(let j = 1; j < Delays.length; j++){
      Delays[j] = GenerateRandomDelay(Delays[j-1]); 
  }
  
  for (let i = 0; i < CurrentSymbols.length; i++){//генерация символов 
    CurrentSymbols[i] = GenerateRandomSymbol();
  }

  SetGame(CurrentSymbols, Delays);
};

//Изменение ставки
addCurrentBetButton.onclick = () => {
  if(CurrentBet >= 5000) return; 
  CurrentBet += 500;
  UpdateUI();
};

decCurrentBetButton.onclick = () => {
  if(CurrentBet <= 500) return;
  CurrentBet -= 500;
  UpdateUI();
};

maxCurrentBetButton.onclick = () => {
  CurrentBet = 5000;
  UpdateUI();
};