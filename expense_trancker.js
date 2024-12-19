// EXPENSE TRACKER CONCEPT
const TR_LocalStorageName = 'transactionsList';

// CREATE A BUDGET INSTANCE FOR BUDGET CLASS
const myBudget = new Budget();
const myUsersList = new UserManager(myBudget);
let inputType;      //THIS WILL INDICATE THE USER'S CHOICE OF INPUT income OR expense
const windowHeight = window.innerHeight;
const titleTopMargin = 30;
let transDElBtns = [];

// DIV FOR INSERT INCOME or EXPENSE DETAILS
const wrapper = document.querySelector(".wrapper");

const modal = document.querySelector(".modal");

const transBtns = document.querySelectorAll(".viewTransactions a");
const viewTrans = document.getElementById("viewAllTrans");
const removeTrans = document.getElementById("removeAllTrans");

// GET ALL INPUT ELEMENTS
const inputNameElement = document.getElementById("transNameField");
const inputAmountElement = document.getElementById("transAmountField");
const inputDateElement = document.getElementById("transDateField");

// GET ALL STATEMENTS
let balanceAmount = document.getElementById("balance_amount");
let incomeAmount = document.getElementById("income_amount");
let expenseAmount = document.getElementById("expense_amount");

// DIV FOR INSERT INCOME or EXPENSE DETAILS
const transDiv = document.querySelector(".transactionDiv");

// SUBMIT BUTTON
const submitBtn = document.getElementById("submitBtn");

// FORM EL/EMENT
const formElement = document.querySelector("#expTrackerForm");

// CLOSE BUTTON OF POPUP TABLE
const closetn = document.querySelector(".close");

// TABLE
const table = document.getElementById("transactionTable");

// TABLE TH REFERS FULL NAME OF THE USER
const spanThElement = document.getElementById("fnameUser");

// ELEMENT OF USER NAME
const nameOfUser = document.getElementById("nameOfUser");

// ELEMENT OF LOGOUT BUTTON
const logoutBtn = document.getElementById("logoutBtn");

// DEFAULT BUTTON FOCUS BEHAVIOUR
const expenseBtn = document.querySelector(".expenseControl #expenseBtn");
const incomeBtn = document.querySelector(".expenseControl #incomeBtn");
incomeBtn.classList.add("buttonFocus");

// CURRENT USER NAME
const currentUser = nameOfUser.innerHTML;

// income and expense total value span
const incTotal = document.getElementById("totalIncomeSpan");
const expTotal = document.getElementById("totalExpenseSpan");

// CREATE CLOSURE FOR BLOCK OPUTSIDE OF PROGRAM
const protectedTransList = () => {
    // TO STRE TRANSACTION DETAILS INTO A VARIABLE FOR HIDE FROM LOCAL STORAGE
    let transArray = JSON.parse(localStorage.getItem(TR_LocalStorageName)) || [];

    return {
        // FUNCTION FOR VIEW ARRAY
        getAllTransactions: () => {
            console.error("Access Denied. This is Protected Data");
            // return transArray;
        },

        // FUNCTION FOR GET LENGTH OF THE ARRAY
        getLengthOfTransList: () => transArray.length,

        // FUNCTION FOR ADD ELEMENT TO THE ARRAY
        addDataToTransList: (trans) => {
            transArray.push(trans);
            console.log(`Added Data = ${trans}`);            
        },

        // FUNCTION FOR REMOVE ELEMENT TO THE ARRAY
        delDataToTransList: (title, amount, date) => {
            const index = transArray.findIndex((trans) => trans.userName===nameOfUser.innerHTML && trans.title===title && trans.amount===amount && trans.date===date);
            console.log(`index = ${index}`);            
            const removedData = transArray.splice(index,1);
            console.log(`Removed Data = ${removedData}`);            
        },

        // Exposing viewArray only through extra validation
        getAllTransactions: (password) => {
            const storedPassword = MPIN;
            if(password===storedPassword) {
                return transArray;
            }
            else {
                console.error("Incorrect Password");
            }
        }
    };
}

let protectedTransArray = protectedTransList();
console.log(protectedTransArray.getAllTransactions(MPIN));

// // FOR CHECK PROTECT TRANSARRAY
// console.log(protectedTransArray.getAllTransactions());
// console.log(protectedTransArray.getAllTransactions("abcdefg"));

// REMOVE DATA FROM LOCAL STORAGE
localStorage.removeItem(TR_LocalStorageName);
    let myData = [];     //TO STORES CURRENT USER'S TRANSACTIONS DATA

function initialDOMRender() {
    const transDom = document.querySelectorAll(".transactionDiv .transaction");
    transDom.forEach((element)=>{
        element.remove();
        checkTransactionOverfolow();
    });
}

function initialData(user) {   
    if(protectedTransArray.getLengthOfTransList()===0) {
        initialDOMRender();
        balanceAmount.innerHTML = 0;
        incomeAmount.innerHTML = 0;
        expenseAmount.innerHTML = 0;
    }

    if(protectedTransArray.getLengthOfTransList()>0) {
        console.log(user);
        myData = protectedTransArray.getAllTransactions(MPIN).filter((trans)=> trans.userName===user);
        console.log(myData);        
        initialDOMRender();
        // FOREACH DOESNOT RETURN ANYTHING
        if(myData.length>0) {
            myData.forEach((trans)=>{
                myBudget.addAllTransactions(trans);
                addTranscationDOM(trans.title, trans.transactionType, trans.amount, trans.date);
            }); 
            checkTransactionOverfolow();
            incomeAmount.innerHTML = myBudget.getTotalIncomeByUserName(user);
            expenseAmount.innerHTML = myBudget.getTotalExpenseByUserName(user);
            balanceAmount.innerHTML = myBudget.getTotalIncomeByUserName(user) - myBudget.getTotalExpenseByUserName(user);
        }
        if(myData.length===0) {
            initialDOMRender();
            balanceAmount.innerHTML = 0;
            incomeAmount.innerHTML = 0;
            expenseAmount.innerHTML = 0;    
        }
        // ADD MY DATA TO LOCAL STORAGE TEMPORARLY
        localStorage.setItem(TR_LocalStorageName, JSON.stringify(myData));
    }
}

inputType = "income";
// initialData();

incomeBtn.addEventListener("click",()=>{
    expenseBtn.classList.remove("buttonFocus");
    incomeBtn.classList.add("buttonFocus");
    inputType = "income";
});

expenseBtn.addEventListener("click",()=>{
    incomeBtn.classList.remove("buttonFocus");
    expenseBtn.classList.add("buttonFocus");
    inputType = "expense";
});

function checkTransactionOverfolow() {
    // console.log(`transDiv.offsetHeight = ${transDiv.offsetHeight}`);    
    // let maxHeight = Math.floor((20*windowHeight)/100);
    // const transDivArray = document.querySelectorAll(".transactionDiv .transaction");
    console.log(`myData Length = ${myData.length}`);    
    if(myData.length>=2) {
            transBtns.forEach((btn)=>{
            btn.style.display = 'block';
        });    
    }
    if(myData.length<2) {
        transBtns.forEach((btn)=>{
            btn.style.display = 'none';
        });    
    }
    // if(transDiv.offsetHeight>=maxHeight) {
    //     transBtns.forEach((btn)=>{
    //         btn.style.display = 'block';
    //     });
    // }
    // if(transDiv.offsetHeight<maxHeight) {
    //     transBtns.forEach((btn)=>{
    //         btn.style.display = 'none';
    //     });
    // }
}

// LOGOUT BUTTON EVENT LISTENER
logoutBtn.addEventListener("click",(event)=>{
    event.preventDefault();

    if(usersBlock.classList.contains("formHide")) {
        usersBlock.classList.remove("formHide");
        wrapperBlock.style.display = 'none';
        usersBlock.style.display = 'flex';
        invalidUser.innerHTML = '';
        console.log(`Logout Successfully`);       

        isLogin = false;
        // loginCredential.userName=null;
        // loginCredential.password=null;
        
        appStatus.on = false;
        appStatus.type = null;
        appStatus.off = true;
        if('credential' in appStatus) {
            delete appStatus.credential;
        }
        localStorage.setItem(AS_LocalStorageName, JSON.stringify(appStatus));
        
        myBudget.clearBudgetData(); 
        
        localStorage.removeItem(TR_LocalStorageName);
        localStorage.removeItem(UL_LocalStorageName);

        switchToSignUp();
    }
});

viewTrans.addEventListener("click",(event)=>{
    event.preventDefault();     //PREVENT DEFAULT BEHAVIOUR OF ANCHOR TAG

    let allTransactions = myBudget.getAllTransactionsUserName(nameOfUser.innerHTML);
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = '';       //CLEAR ANY ROW EXISTING
    let colorVal;

    console.log(`current user name : ${nameOfUser.innerHTML}`);    
    let userDetails = myUsersList.getUserByUserName(nameOfUser.innerHTML);
    console.log(userDetails);    
    spanThElement.innerHTML = userDetails.fullName;

    allTransactions.forEach((rowData,index)=>{
        // CREATE ROW FOR EACH ROW DATA
        let rowElement = document.createElement("tr");
        // CREATE CEL FOR S.NO. TD
        let firstCell = document.createElement("td");
        firstCell.textContent = index+1;
        rowElement.appendChild(firstCell);
        // REMAINING DATA CELLS
        for(let key in rowData) {
            if(rowData.hasOwnProperty(key)) {
                if(rowData[key]!==nameOfUser.innerHTML) {
                    if(rowData[key]==='income') {
                        colorVal = 'green';
                    }
                    if(rowData[key]==='expense') {
                        colorVal = 'red';
                    }
                    let cell = document.createElement("td");
                    cell.textContent = rowData[key];
                    // cell.style.backgroundColor = 'green';
                    cell.style.color = colorVal;    
                    rowElement.appendChild(cell);
                }
            }
        }
        tbody.appendChild(rowElement);
        incTotal.innerHTML = myUsersList.searchBudgetByUserName(nameOfUser.innerHTML).income;
        expTotal.innerHTML = myUsersList.searchBudgetByUserName(nameOfUser.innerHTML).expense;
    });
    // DISPLAY THE MODAL
    modal.style.display = 'block';
    console.log(`table.offsetHeight : ${table.offsetHeight}`);    
    let maxHeight = Math.floor((90*windowHeight)/100);
    if(table.offsetHeight>=maxHeight) {
        table.style.overflowY = 'auto';
    }

    // CLOSE THE MODAL WHEN USER CLICK CLOSE BUTTON
    closetn.addEventListener("click",()=>{
        modal.style.display = 'none';
    });
});

removeTrans.addEventListener("click",(event)=>{
    event.preventDefault();     //PREVENT DEFAULT BEHAVIOUR OF ANCHOR TAG

    // GET ALL THE DIVS 
    const allTransDivs = document.querySelectorAll(".transaction");
    // REMOVE DATA AT FRONT END 
    Array.from(allTransDivs).forEach((div)=>{
        div.remove();       //REMOVE ALL CREATED DIV
    });
    // REMOVE DATA AT BACKEND
    myBudget.clearBudgetData();     //CLEAR ALL BUDGET DATA
    transBtns.forEach((btn)=>{
        btn.style.display = 'none';
    });
    initialData();
    console.log(myBudget.getAllPersonsIncome());    
    console.log(myBudget.getAllPersonsExpense());    
    console.log(myBudget.getAllPersonsTransactions());    
});

formElement.addEventListener("submit",(event) => {
    event.preventDefault();

    const inputName = inputNameElement.value;
    const inputAmount = parseFloat(inputAmountElement.value);
    const inputDate = inputDateElement.value;

    console.log(`INPUT TYPE = ${inputType}`);
    console.log(`NAME = ${inputName}`);
    console.log(`AMOUNT = ${inputAmount}`);
    console.log(`DATE = ${inputDate}`);

    // ADD ALL TRANSACTIONS TO BUDGET
    let transObj = {
        userName:nameOfUser.innerHTML,
        transactionType: inputType,
        title: inputName,
        amount: inputAmount,
        date: inputDate
    };

    // STORE THIS TRANSACTIONS TO LOCAL STORAGE
    protectedTransArray.addDataToTransList(transObj);
    myData.push(transObj);
    localStorage.setItem(TR_LocalStorageName, JSON.stringify(myData));

    myBudget.addAllTransactions(transObj);
    let allTransactions = myBudget.getAllTransactionsUserName(nameOfUser.innerHTML);
    console.log(allTransactions);    
    let totalIncomes = myBudget.getTotalIncomeByUserName(nameOfUser.innerHTML);
    console.log(totalIncomes);
    let totalExpense = myBudget.getTotalExpenseByUserName(nameOfUser.innerHTML);
    console.log(totalExpense);
    
    // FRONT-END (DOM) SECTION
    updateStatement();
    addTranscationDOM(inputName,inputType,inputAmount,inputDate);
    checkTransactionOverfolow();

    inputNameElement.value = '';
    inputAmountElement.value = '';
    inputDateElement.value = '';

});

function updateStatement() {
    const allTransDetails = myBudget.getAllTransactionsUserName(nameOfUser.innerHTML);
    let balAmount, incAmount=0, expAmount=0;
    
    allTransDetails.forEach((transaction)=>{
        if(transaction.transactionType==='income') {
            incAmount += transaction.amount;
        }
        if(transaction.transactionType==='expense') {
            expAmount += transaction.amount;
        }
    });

    balAmount = incAmount - expAmount;

    balanceAmount.innerHTML = balAmount;    
    incomeAmount.innerHTML = incAmount;    
    expenseAmount.innerHTML = expAmount;    
}

function addTranscationDOM(transNameVal, type, amount, date) {
    // CREATE A TRANSACTION DIV AND APPEND IT CHILD TO TANSACTIONDIV
    const transaction = document.createElement('div');
    transaction.classList.add("transaction");
    transDiv.insertBefore(transaction, transDiv.firstChild);
    
    // create a transactionDiv div
    const transDetails = document.createElement('div');
    transDetails.classList.add("transDetails");
    transaction.appendChild(transDetails);

    const transTitle = document.createElement('h3');
    transDetails.id = "transName";
    transDetails.appendChild(transTitle);

    const specialDiv = document.createElement('div');
    specialDiv.classList.add("rightFlex");
    transDetails.appendChild(specialDiv);

    const transAmount = document.createElement('h3');
    transAmount.id = "transAmount";
    specialDiv.appendChild(transAmount);

    const transVal = document.createElement('span');
    transVal.id = "transAmountVal";
    transAmount.appendChild(transVal);

    const delBtn = document.createElement('button');
    delBtn.classList.add("delTransButton"); 
    delBtn.dataset.index = (myBudget.getAllTransactionsUserName(nameOfUser.innerHTML).length)-1;
    specialDiv.appendChild(delBtn);

    const delBtnImg = document.createElement("img");
    delBtnImg.src = "./delete.png";
    delBtnImg.classList.add("delTransIcon"); 
    delBtn.appendChild(delBtnImg);

    const transDate = document.createElement('p');
    transDate.id = "transDate";
    transaction.appendChild(transDate);

    transTitle.innerHTML = transNameVal;
    transVal.innerHTML = "&#8377; " + amount;
    if(type==="income") {
        transAmount.style.color = 'green';
    }
    else {
        transAmount.style.color = 'red';
    }
    transDate.innerHTML = date;
    transDElBtns.push(delBtn);
    
    delBtn.addEventListener("click",(event)=>{
        event.preventDefault();
        const index = delBtn.dataset.index;
        // COLLECT DATA FOR REMOVE FROM TRANSARRAY
        let title = myData[index].title;
        let amount = myData[index].amount;
        let date = myData[index].date;

        // divArray[index].remove();
        let findParent = delBtn.closest(".transaction");
        if(findParent) {
            findParent.remove();
        }
        let transLength = document.querySelectorAll(".transaction");
        console.log(`divArray.length = ${transLength.length}`);        
        // BACKEND UPDATE
        myBudget.removeBudgetByPosition(index);
        let allTransactions = myBudget.getAllTransactionsUserName(nameOfUser.innerHTML);
        console.log('All TRansactions afterr Delete = ',allTransactions);        
        
        // REMOVE DATA FROM TRANSARRAY
        // removeTransactionFromLS(title, amount, date);
        protectedTransArray.delDataToTransList(title, amount, date);
        console.log('Trans Array afterr Delete = ', protectedTransArray.getAllTransactions(MPIN));        

        // // REMOVE DATA FROM MYDATA
        myData.splice(index,1);
        localStorage.setItem(TR_LocalStorageName, JSON.stringify(myData));
        console.log('My data afterr Delete = ', myData);        

        console.log(`Button ${index} Clicked`);            
        console.log(myBudget.getAllTransactionsUserName(nameOfUser.innerHTML));        
        updateTransactionDOM();
        updateStatement();
    });
}

// function removeTransactionFromLS(title, amount, date) {
//     const transArray = protectedTransArray.getAllTransactions();
//     const index = transArray.findIndex((trans) => trans.userName===nameOfUser.innerHTML && trans.title===title && trans.amount===amount && trans.date===date);
//     transArray.splice(index, 1);
// }

function updateTransactionDOM() {
    let transElements = document.querySelectorAll(".delTransButton");
    let j=0;
    console.log(`transElement Length = ${transElements.length}`);    
    for(let i=transElements.length-1;i>=0;i--) {
        transElements[j++].dataset.index = i;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(appStatus.on===true) {
        const type = appStatus.type;
        if(type==='login') {
            let currentProfile = JSON.parse(localStorage.getItem(AS_LocalStorageName));
            console.log(currentProfile);        
            isLogin = loginAuthentication(currentProfile.credential.userName, currentProfile.credential.password);
            if(isLogin===true) {
                loadLoginPage();
            }
        }
        if(type==='signup') {
            switchToLogin();
        }
        if(type===null) {
            switchToSignUp();
        }
    }
});

// Save data to localStorage on visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Save the TRANSACTION data to localStorage
        const transArray = protectedTransArray.getAllTransactions(MPIN);
        localStorage.setItem(TR_LocalStorageName, JSON.stringify(transArray));
        // SAVE USER LIST TO LOCALSTORAGE
        const userListArray = protectedUsers.getAllUsers(MPIN);
        localStorage.setItem(UL_LocalStorageName, JSON.stringify(userListArray));
    }
});
