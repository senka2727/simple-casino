const reels = document.querySelectorAll(".Reel");
const spinButton = document.getElementById("SpinButton");

const symbolHeight = 145;
const symbolsCount = reels[0].children.length;
let position = 0;
let speed = 0;
let spinning = false;

let reelStopped = new Array(reels.length).fill(false);

let CurrentBalance = 100000;
const CurrentBalanceText = document.getElementById("CurrentBalanceText");
let CurrentBet = 500;
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

  if(ReelID == 2){ 
    spinning = false;
    CalculateWin();
  }
}

function SetGame(FirstReelSymb, FirstReelDel, SecondReelSymb, SecondReelDel, ThirdReelSymb, ThirdReelDel){
  setTimeout(() => {StopReelOnSymbol(0, FirstReelSymb)}, FirstReelDel * 1000);
  setTimeout(() => {StopReelOnSymbol(1, SecondReelSymb)}, SecondReelDel * 1000);
  setTimeout(() => {StopReelOnSymbol(2, ThirdReelSymb)}, ThirdReelDel * 1000);
}

function CalculateWin(){
  let totalSymbols = CurrentSymbols[0].toString() + CurrentSymbols[1].toString() + CurrentSymbols[2].toString();
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

function GenerateRandomSymbol(){
  return Math.floor(Math.random() * 2);
}

function GenerateRandomDelay(PreviousDelay){
  return (Math.floor(Math.random() * 3) + 0.5 + PreviousDelay);
}

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
  speed = 100; //начальная скорость

  reelStopped.fill(false);
  
  let Delays = [GenerateRandomDelay(0), 0, 0]; //генерация делеев
  Delays[1] = GenerateRandomDelay(Delays[0]); 
  Delays[2] = GenerateRandomDelay(Delays[1]);
  
  for (let i = 0; i < CurrentSymbols.length; i++){//генерация символов 
    CurrentSymbols[i] = GenerateRandomSymbol();
  }

  SetGame(CurrentSymbols[0], Delays[0], 
  CurrentSymbols[1], Delays[1],
  CurrentSymbols[2], Delays[2]);
};

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