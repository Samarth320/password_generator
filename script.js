const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_+-=][}{|\';":/.,?><*'

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

// functions

function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // background color of slider for selected range of password length
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min))+"% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    //set shadow
}

function getRndInteger(min , max)
{
    return Math.floor( Math.random() * (max-min) ) + min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols()
{
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked)
    hasUpper = true;

    if(lowercaseCheck.checked)
    hasLower = true;

    if(numbersCheck.checked)
    hasNum = true;

    if(symbolsCheck.checked)
    hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasSym || hasNum) && passwordLength >=6 )
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try
    {
     await navigator.clipboard.writeText(passwordDisplay.value);
     copyMsg.innerText = "Copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed";
    }

    // to make copy vala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input' , (e)=>
{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value) //if password value is not empty
    {
        copyContent();
    }
});

function handleCheckBoxChange()
{
    checkCount = 0;

    allCheckbox.forEach((checkbox)=> {
        if(checkbox.checked)
        checkCount++;
    });

    //special case
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange)
});

generateBtn.addEventListener('click' , ()=>{

    // none of the checkbox are selected
    if(checkCount == 0) 
    return;

    //verify this no needed
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //lets create the password

    // remove old password
    password = "";

    // lets put the stuff mentioned by the checkboxes

    // if(uppercaseCheck.checked)
    // {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked)
    // {
    //     password += generatelowerCase();
    // }

    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked)
    // {
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUpperCase);    // check this love has not enter the () these brackets
    }

    if(lowercaseCheck.checked)
    {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbols);
    }

    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength - funcArr.length; i++)
    {
        let randIndex = getRndInteger(0 , funcArr.length)    // check this it should be length-1
        // console.log("random="+randIndex);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // display the password on UI
    passwordDisplay.value = password;

    // calculate the strength
    calcStrength();

});

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}