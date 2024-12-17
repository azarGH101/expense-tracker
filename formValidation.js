// USER SIGN UP LOGIN FORM HANDLING

const lCase = 'abcdefghijklmnopqrstuvwxyz';
const uCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '1234567890';
const eChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const characters = lCase + uCase + digits + eChars;
let array = [uCase,lCase,digits,eChars];

// const result = document.getElementById("captcha");
const passMinLen = 8;
const min = 0;
const minVal = 0;
const maxVal = 26;

const UL_LocalStorageName = 'usersList';
const AS_LocalStorageName = 'appStatus';

// FORM SUBMISSION VCARIABLES
const signUpForm = document.getElementById("myUserForm");
const logInForm = document.getElementById("myUserLoginForm");

// GET FORM ELEMENTS
const signUpElement = document.querySelector(".users .register");
const logInElement = document.querySelector(".users .logIn");

const newUser = document.getElementById("newUser");
const existUser = document.getElementById("existUser");

const usersBlock = document.querySelector(".users");
const wrapperBlock = document.querySelector(".wrapper");

// INVALID USER FIELD VARIABLE
const invalidUser = document.getElementById("errorMsg");

signUpElement.style.display = 'block';
signUpElement.classList.add("formShow");

let isSignedUp = false;
let isLogin = false;

// 
function encryptString(mpin) {
    let encrypedMpin = "";

    let uc=0, lc=0, dg=0, ec=0, index;

    for(let i=0;i<mpin.length;i++) {
        if(mpin[i]>='A'&&mpin[i]<='Z') {
            uc++;
            encrypedMpin += "$";
            index = uCase.indexOf(mpin[i]);
            encrypedMpin += ((index*index)+index);
        }
        else if(mpin[i]>='a'&&mpin[i]<='z') {
            lc++;
            encrypedMpin += "#";
            index = lCase.indexOf(mpin[i]);
            encrypedMpin += ((index*index*index)+index);
        }
        else if(mpin[i]>='0'&&mpin[i]<='9') {
            dg++;
            encrypedMpin += "&";
            index = digits.indexOf(mpin[i]);
            encrypedMpin += ((index*786)-index);
        }
        else {
            ec++;
            encrypedMpin += "*";
            index = eChars.indexOf(mpin[i]);
            encrypedMpin += ((index*13)+index);
        }
    }
    return encrypedMpin;
}

// DECRYPT ENCRYPTED STRING
function decryptString(encryptTxt) {
    let decryptString = "";
    let numVal = "";
    let cType;
    for(let i=0;i<encryptTxt.length;i++) {
        if(encryptTxt[i]==="$" || encryptTxt[i]==="#" || encryptTxt[i]==="&" || encryptTxt[i]==="*") {
            if(numVal.length>0) {
                let eNum = new Number(numVal)+0;
                let ch = getCharacter(eNum, cType);
                decryptString += ch;
                numVal = "";
                cType = encryptTxt[i];
            }
            if(numVal.length===0) {
                cType = encryptTxt[i];
            }
        }
        else {
            numVal += encryptTxt[i];
        }
    }
    let eNum = new Number(numVal)+0;
    let ch = getCharacter(eNum, cType);
    decryptString += ch;

    return decryptString;
}

function getCharacter(num, type) {
    // FIND ACTUAL INDEX OF THE CHARACTER
    let index;
    let char;
    for(let i=minVal;i<maxVal;i++) {
        if((i*i)+i===num) {
            index=i;
            break;
        }
        if((i*i*i)+i===num) {
            index=i;
            break;
        }
        if((i*786)-i===num) {
            index=i;
            break;
        }
        if((i*13)+i===num) {
            index=i;
            break;
        }
    }

    if(type==="$")
        char = uCase[index];
    if(type==="#")
        char = lCase[index];
    if(type==="&")
        char = digits[index];
    if(type==="*")
        char = eChars[index];
    
     return char;
}

// CREATE MPIN AUTOMATICALLY
function getRandom(from, to) {
    return Math.floor(Math.random() * ((to-from)+1) + from);
}

function createStrongPassword() {
    let empty = [],i,j=0,max,rnum;
    let pswd = "";

    while(j<array.length) {
        let tmp = getRandom(min,array.length-1);
        if(!empty.includes(tmp)) {
            empty.push(tmp);
            // console.log('Num : ',tmp);
            max = array[tmp].length-1;
            rnum = getRandom(min,max);
            pswd += array[tmp].charAt(rnum);
            j++;
        }
    }

    max = digits.length-1;
    rnum = getRandom(min,max);
    pswd += digits.charAt(rnum);
    for(i=array.length+1;i<passMinLen;i++) {
        max = characters.length-1;
        rnum = getRandom(min,max);
        pswd += characters.charAt(rnum);
    }
    return pswd;
}

// GET APPLILCATION FROIM LOCAL STORAGE
let appStatus = JSON.parse(localStorage.getItem(AS_LocalStorageName)) || {on:false,type:null,off:true};
console.log(appStatus);

// CREATE CLOSURE FOR BLOCK OPUTSIDE OF PROGRAM
const protectedUserList = () => {
    let userListArray = JSON.parse(localStorage.getItem(UL_LocalStorageName)) || [];
    // console.log(userListArray);

    return {
        // FUNCTION FOR VIEW ARRAY
        getAllUsers: () => {
            console.error("Access Denied. This is Protected Data");
        },

        // FUNCTION FOR GET LENGTH OF THE ARRAY
        getLengthOfUsersList: () => userListArray.length,

        // FUNCTION FOR ADD ELEMENT TO THE ARRAY
        addUsertoUserList: (user) => {
            userListArray.push(user);
            console.log(`Added User = ${user}`);            
        },

        // Exposing viewArray only through extra validation
        getAllUsers: (password) => {
            const storedPassword = MPIN;
            if(password===storedPassword) {
                return userListArray;
            }
            else {
                console.error("Incorrect Password");
            }
        }
    };
}

const MPIN = createStrongPassword();

let protectedUsers = protectedUserList();
console.log(protectedUsers.getAllUsers(MPIN));  //"Me_Admin101"

// REMOVE USER LIST FROM LOCAL STORAGE
localStorage.removeItem(UL_LocalStorageName);
let myProfile = {};     //TO STORES CURRENT USER'S TRANSACTIONS DATA

function checkAuth() {
    if(appStatus.on===false) {
        usersBlock.style.display="flex";
    }
}

checkAuth();

if(protectedUsers.getLengthOfUsersList()===0) {
    existUser.style.pointerEvents = "none"; // Disable pointer events
    existUser.style.cursor = "not-allowed"; // Change the cursor
}

function addUsersToUsersList() {
    const userListArray = protectedUsers.getAllUsers(MPIN);
    userListArray.forEach((user)=>{
        let fname = user.fullName;
        let uname = user.userName;
        let mail = user.email;
        let pwd = user.password;

        myUsersList.addUser(fname, uname, mail, pwd);
    });
}

function switchToLogin() {
    signUpElement.classList.remove("formShow");
    signUpElement.classList.add("formHide");
    signUpElement.style.display = 'none';

    logInElement.style.display = 'block';
    logInElement.classList.add("formShow");
}

function switchToSignUp() {
    logInElement.classList.remove("formShow");
    logInElement.classList.add("formHide");
    logInElement.style.display = 'none';

    signUpElement.style.display = 'block';
    signUpElement.classList.add("formShow");
}

existUser.addEventListener("click",()=>{
    if(signUpElement.classList.contains("formShow")) {
        console.log(`Login Started`);        
        switchToLogin();
    }
});

newUser.addEventListener("click",()=>{
    if(logInElement.classList.contains("formShow")) {
        console.log(`Sign Up Started`);     
        switchToSignUp();
    }
});

// Regular expression for basic username validation
/*
    USER NAME CONDITIONS
    Length ≥ 5 characters.
    At least 3 alphabets (A-Z, a-z).
    Numbers are optional.
    Only letters and numbers are allowed (no other special characters).
    The username can either be:
    Only alphabets (with at least 3 alphabets), or
    Alphanumeric (with at least 3 alphabets).
*/
    const userNameRegex = /^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9]{5,}$/;

    // Regular expression for basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Regular expression for basic Password Verification
    // const pswdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=}{?.>,<]){8,}$/;
    const pswdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Test an user name
    function validateUsername(uname) {
        return userNameRegex.test(uname);
    }

    // Test an email address
    function validateEmail(email) {
        return emailRegex.test(email);
    }

    // Test an email address
    function validatePassword(pswd) {
        return pswdRegex.test(pswd);
    }

    // SHOW USERS DEFAULT
    usersBlock.style.display = 'flex';
    usersBlock.classList.add("formShow");

// SIGNUP FORM VALIDATION PROCESS
function signUpValidation() {
    // GET FORM ELEMENT
    const myForm = document.getElementById("myUserForm");

    // INPUT FIELD VARIABLE DECLERATION
    const fname = document.getElementById("full_name");
    const uname = document.getElementById("user_name");
    const email = document.getElementById("mail");
    const pswd = document.getElementById("pwd");
    const cpswd = document.getElementById("confirm_pwd");

    // GET ALL ERROR INPUT PARA TAG
    const fnameErr = document.getElementById("fnameErr");
    const unameErr = document.getElementById("unameErr");
    const mailErr = document.getElementById("emailErr");
    const pswdErr = document.getElementById("pwdErr");
    const cPswdErr = document.getElementById("cPswdErr");

    let inpDet;

    myForm.addEventListener("submit",function(event) {
        event.preventDefault();     //PREVENT FROM SUBMISSION

        const fnameVal = fname.value;
        const unameVal = uname.value;
        const mail = email.value;
        const passwordVal = pswd.value;
        const cPasswordVal = cpswd.value;

        inpDet=0;
        
        // VALIDATE FULL NAME
        if(fnameVal==='') {
            fnameErr.innerHTML='Full Name Required';
            fname.classList.add("inpError");
            success=false;
        }
        else {
            fnameErr.innerHTML='';
            fname.classList.remove("inpError");
            inpDet++;
        }

        // VALIDATE USERNAME
        if(unameVal==='') {
            unameErr.innerHTML='Username Required';
            uname.classList.add("inpError");
            success=false;
        }
        else {
            if(!validateUsername(unameVal)) {
                unameErr.innerHTML='Username Required';
                uname.classList.add("inpError");
                success=false;
            }
            else {
                unameErr.innerHTML='';
                uname.classList.remove("inpError");
                inpDet++;
            }
        }
        // VALIDATE EMAIL
        if(mail==='') {
            mailErr.innerHTML='Email Id Required';
            email.classList.add("inpError");
            success=false;
        }
        else {
            if(!validateEmail(mail)) {
                mailErr.innerHTML='Please Enter a Valid Email Id';
                email.classList.add("inpError");
                success=false;
            }
            else {
                mailErr.innerHTML='';
                email.classList.remove("inpError");
                inpDet++;
            }
        }
        // validate password
        if(passwordVal==='') {
            pswdErr.innerHTML='Password Required';
            pswd.classList.add("inpError");
            success=false;
        }
        else {
            if(!validatePassword(passwordVal)) {
                pswdErr.innerHTML='Please Enter a Valid Password';
                pswd.classList.add("inpError");
                success=false;
            }
            else {
                pswdErr.innerHTML='';
                pswd.classList.remove("inpError");
                inpDet++;
            }
        }
        // validate confirm password
        if(cPasswordVal==='') {
            cPswdErr.innerHTML='Confirm Password Required';
            cpswd.classList.add("inpError");
            success=false;
        }
        else {
            if(cPasswordVal!==passwordVal) {
                cPswdErr.innerHTML='Password Not Matched';
                cpswd.classList.add("inpError");
                success=false;
            }
            else {
                cPswdErr.innerHTML='';
                cpswd.classList.remove("inpError");
                inpDet++;
            }
        }

        console.log(inpDet);

        // POPUP FOR CORRECT SUBMISSION
        if(inpDet===5) {
            fname.value = '';
            email.value = '';
            uname.value = '';
            pswd.value = '';
            cpswd.value = '';

            isSignedUp = true;

            appStatus.on = true;
            appStatus.type = 'signup';
            appStatus.off = false;
            localStorage.setItem(AS_LocalStorageName, JSON.stringify(appStatus));

            myUsersList.addUser(fnameVal, unameVal, mail, encryptString(passwordVal));
            myProfile = {
                fullName: fnameVal,
                userName: unameVal,
                email: mail,
                password: encryptString(passwordVal)
            };
            protectedUsers.addUsertoUserList(myProfile);
            showPopup();
            
            // ADD USER DATA TO LOCAL STORAGE
            // localStorage.setItem(UL_LocalStorageName, JSON.stringify(myProfile));
        }
    });
}

// Function to show the popup
function showPopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.add('show');
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('show');
    switchToLogin();
}

// CLEAR ALL FIELDS OF INNER FORM FOR PREVENT AUTO FILLING
function clearInnerForm() {
    const inputFields = document.querySelectorAll("#expTrackerForm input");
    inputFields.forEach((input)=>{
        // CLEAR EACH INPUT FIELD
        input.value = '';
    });
}

// CALL SIGNUP VALIDATION
signUpValidation();

// LOGIN FORM VALIDATION PROCESS
function loginValidation() {
    // LOGIN FORM
    const myForm = document.getElementById("myUserLoginForm");

    // INPUT FIELD VARIABLE DECLERATION
    const uname = document.getElementById("user_name1");
    const pswd = document.getElementById("pwd1");

    // ERROR VARIABLE DECLERATION
    const unameErr = document.getElementById("unameErr1");
    const pswdErr = document.getElementById("pswdErr1");

    myForm.addEventListener("submit",(event)=>{
        event.preventDefault();

        const unameVal = uname.value;
        const passwordVal = pswd.value;

        let success = true;
        let inpDet=0;

        // VALIDATE USERNAME
        if(unameVal==='') {
            unameErr.innerHTML='Username Required';
            uname.classList.add("inpError");
            success=false;
        }
        else {
            if(!validateUsername(unameVal)) {
                unameErr.innerHTML='Username Required';
                uname.classList.add("inpError");
                success=false;
            }
            else {
                unameErr.innerHTML='';
                uname.classList.remove("inpError");
                inpDet++;
            }
        }
        // validate password
        if(passwordVal==='') {
            pswdErr.innerHTML='Password Required';
            pswd.classList.add("inpError");
            success=false;
        }
        else {
            if(!validatePassword(passwordVal)) {
                pswdErr.innerHTML='Please Enter a Valid Password';
                pswd.classList.add("inpError");
                success=false;
            }
            else {
                pswdErr.innerHTML='';
                pswd.classList.remove("inpError");
                inpDet++;
            }
        }

        if(inpDet===2 && success===true) {
            isLogin = loginAuthentication(unameVal,encryptString(passwordVal));
            console.log(isLogin);            
            if(isLogin===true) {
                appStatus.on = true;
                appStatus.type = 'login';
                appStatus.off = false;
                // ADD NEW PROBERTY WHEN TYPE = LOGIN
                appStatus.credential = {
                    userName:unameVal,
                    password:encryptString(passwordVal)
                };
                console.log(appStatus);                
                localStorage.setItem(AS_LocalStorageName, JSON.stringify(appStatus));
                loadLoginPage();
            }
            else {
                invalidUser.innerHTML = `Invalid Username or Password`;
            }
        }
    });
}

// CALL LOGIN VALIDATION
loginValidation();

function loginAuthentication(uname, pswd) {
    const userListArray = protectedUsers.getAllUsers(MPIN);    
    for(let i=0;i<userListArray.length;i++) {        
        if(userListArray[i].userName===uname && userListArray[i].password===pswd) {
            myProfile = {
                fullName: userListArray[i].fullName,
                userName: userListArray[i].userName,
                email: userListArray[i].email,
                password: userListArray[i].password
            };
            return true;
        }
    }
    return false;
}

function loadLoginPage() {
    console.log(`${appStatus.credential.userName} Login Successfully`);                
    if(document.getElementById("user_name1").value!=='' && document.getElementById("pwd1").value!=='') {
        document.getElementById("user_name1").value = '';
        document.getElementById("pwd1").value = '';
    }
    localStorage.setItem(UL_LocalStorageName, JSON.stringify(myProfile));
    
    if(usersBlock.classList.contains("formShow")) {
        // usersBlock.classList.remove("formShow");
        usersBlock.classList.add("formHide");
        usersBlock.style.display = 'none';
        wrapperBlock.style.display = 'block';
        addUsersToUsersList();
        nameOfUser.innerHTML = appStatus.credential.userName;
        initialData(nameOfUser.innerHTML);
        // myUsersList.getAllUsers();
        clearInnerForm();
    }
}