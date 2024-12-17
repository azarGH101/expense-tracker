// CREATE CLASS FOR MANAGE MUTILE USERS
class UserManager {
    constructor(budget) {
        this.users = [];
        this.budget = budget;
    }

    // ADD USERS TO USERS LIST
    addUser(fullName, userName, email, pswd) {
        let userData = new User(fullName, userName, email, pswd);
        this.users.push(userData);
    }

    // DISPLAY ALL USERS DATA
    getAllUsers() {
        console.log('USER-NAME\t\tE-MAIL');
        this.users.forEach((user)=>{
            console.log(`${user.userName}\t\t${user.email}`);            
        });
    }

    getAllPersonsBudget() {
        this.budget.getAllPersonsTransactions();
    }
    
    // GET USER BY E-MAIL
    getUserByUserName(uName) {
        let searchUser = this.users.find(user=>user.userName===uName);
        if(searchUser) {
            // console.log(`User Name = ${searchUser.userName}
            //     E-Mail Id = ${searchUser.email}`);
            return searchUser;
        }
        else
            // console.log(`${email} Does Not Exist`);
            return null;
    }

    // REṀOVE AM USER BY EMAIL
    removeUserByUserName(uName) {
        let userIndex = this.users.findIndex(user=>user.userName===uName);
        if(userIndex!=-1) {
            // REMOVE USER FROM USER MANAGER
            this.users.splice(userIndex,1);     //REMOVE AN ELEMENT
            // REMOVE CURRESPONDING BUDGET
            this.budget.removeBudgetByUserName(uName);
        }
        else {
            console.log('Does Not Exist');
        }
    }

    searchBudgetByUserName(uName) {
        let budget = {income:0,expense:0};
        const totalIncome = this.budget.getTotalIncomeByUserName(uName);
        if(totalIncome) {
            const totalExpense = this.budget.getTotalExpenseByUserName(uName);
            budget.income += totalIncome;
            budget.expense += totalExpense;
            return budget;
        }
        else {
            return `${uName} Doesn't Exist`;
        }
    }

    getMyAllTransactions(uName) {
        let result = this.budget.getAllTransactionsUserName(uName);
        return result;
    }
}

// CREATE A CLASS FOR USER
class User {
    constructor(fullName, userName, email, pswd) {
        this.fullName = fullName;
        this.userName = userName;
        this.email = email;
        this.pswd = pswd;
    }

    getFullName() {
        return this.fullName;
    }
    getUserName() {
        return this.userName;
    }
    getEmail() {
        return this.email;
    }
}

class Income {
    constructor(title, amount, date) {
        this.title = title;
        this.amount = amount;
        this.date = date;
    }

    // ENCAPSULATION START
    getTitle() {
        return this.title;
    }
    getAmount() {
        return this.amount;
    }
    getDate() {
        return this.date;
    }
    // ENCAPSULATION END
}

// CREATE EXPENSE CLASS INHERITE INCOME DATA
class Expense {
    constructor(title, amount, date) {
        this.title = title;
        this.amount = amount;
        this.date = date;
    }

    // ENCAPSULATION START
    getTitle() {
        return this.title;     //POLYMORPHISM
    }
    getAmount() {
        return this.amount;   
    }
    getDate() {
        return this.date;
    }
    // ENCAPSULATION END
}

// CREATE A CLASS FOR BUDGET
class Budget {
    constructor() {     
        this.transactions = [];     //STORE BOTH INCOME AND EXPENSES
    }

    // FUNCTION FOR ADD INCO;ME & EXPENSE
    addAllTransactions(incomeData) {
        this.transactions.push(incomeData);
    }

    getTotalIncomeByUserName(uName) {
        let total = 0;
        this.transactions.forEach((data)=>{
            if(data.userName===uName && data.transactionType==="income") {
                total += data.amount;
            }
        });
        return total;
    }

    // FUNCTION FOR VIEW ALL EXPENSES
    getTotalExpenseByUserName(uName) {
        let total = 0;
        this.transactions.forEach((data)=>{
            if(data.userName===uName && data.transactionType==="expense") {
                total += data.amount;
            }
        });
        return total;
    }

    getAllTransactionsUserName(uName) {
        let completeTransList = [];
        this.transactions.forEach((data)=>{
            if(data.userName===uName) {
                completeTransList.push(data);
            }
        });
        return completeTransList;
    }

    clearBudgetData() {
        this.transactions = [];     
    }

    removeBudgetByPosition(pos) {
        this.transactions.splice(pos,1);
        return this.transactions;
    }

    // removeBudgetByUserName(uName) {
    //     // REMOVE INCOME DATA
    //     for(let i=0;i<this.incomes.length;i++) {
    //         if(this.incomes[i].userName===uName) {
    //             this.incomes.splice(i,1);       //REMOVED MATCHED INDEX
    //             i--;
    //         }
    //     }
    //     // REMOVE EXPENSE DATA
    //     for(let i=0;i<this.expenses.length;i++) {
    //         if(this.expenses[i].userName===uName) {
    //             this.expenses.splice(i,1);       //REMOVED MATCHED INDEX
    //             i--;
    //         }
    //     }
    // }

    // // FIND BUDGET SCORE
    // getBudgetScore() {
    //     let expensePercentage;
    //     expensePercentage = ((this.getTotalExpenses()/this.getTotalIncomes())*100).toFixed(2);
    //     return expensePercentage;        
    // }
}

