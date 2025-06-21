const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>/?`~";


let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

console.log("app started")
// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = parseInt(inputSlider.min);
    const max = parseInt(inputSlider.max);
    const percent = ((passwordLength - min) * 100) / (max - min);

    inputSlider.style.background = `linear-gradient(to right, var(--vb-violet) 0%, var(--vb-violet) ${percent}%, var(--lt-violet) ${percent}%, var(--lt-violet) 100%)`;
}


// setIndicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px  0px  12px 1px ${color}`
    // shadow
}

function getRanInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min 
}

function generateRandomNumber(){
    return getRanInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRanInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRanInteger(65,91));
}

function generateSymbol(){
    const randNum = getRanInteger(0,symbols.length)
    return symbols.charAt(randNum);
}


function calcStrength() {
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNumber = numbersCheck.checked;
    const hasSymbol = symbolsCheck.checked;

    let strength = 0;
    if (hasUpper) strength++;
    if (hasLower) strength++;
    if (hasNumber) strength++;
    if (hasSymbol) strength++;

    // Decide color based on strength and length
    if (strength >= 3 && passwordLength >= 8) {
        // strong
        setIndicator("#0f0"); // green
    } else if (strength >= 2 && passwordLength >= 6) {
        // medium
        setIndicator("#ff0"); // yellow
    } else {
        // weak
        setIndicator("#f00"); // red
    }
}
 
async function copyContent(){
    try{
        navigator.clipboard.writeText(passwordDisplay.value);   //this method copies the password written and returns a promise
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active")

    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },2000)
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = Array.length-1 ; i>0 ; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j]  = temp;
    }
    return array.join(""); // cleaner way to convert to string
}

function handleCheckboxChange(){
    checkCount =0;
    allCheckBox.forEach((checkBox) =>{
        if(checkBox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change' , handleCheckboxChange)
})

inputSlider.addEventListener('input' , (e) =>{
    passwordLength = e.target.value;
    handleSlider() 
})

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click' , ()=>{
     //none of the checkbox are selected
     if(checkCount<=0) return;
     if(passwordLength < checkCount){
         passwordLength = checkCount;
         handleSlider();
     }

     //find new password
     console.log("Starting the Journey")

     //remove old password

     password = "";

    

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase)

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase)

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber)

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol)

    //compulsory addition
    for(let i = 0 ; i<funcArr.length ; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done")

    //remaining addition
    for(let i=0 ; i<passwordLength-funcArr.length  ; i++ ){
        let randIndex = getRanInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done")

    //shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("Shuffling done")
    //show in UI
    passwordDisplay.value = password;
    console.log("UI Done")
    // calculate strength
    calcStrength()
})


