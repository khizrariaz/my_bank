#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
//customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fname, lName, // small L = l
    age, gender, mob, acc) {
        this.firstName = fname;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
//class bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccounyNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let newAccount = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...newAccount, accobj];
    }
}
let myBank = new Bank(); //myBank = HBL/ MEEZAN
//customer creating
for (let i = 1; i <= 3; i++) {
    let fname = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    //parseint= js ka built in function jo string ko num me chng krta h
    const cus = new Customer(fname, lName, 25 * i, "male", num, 1000 + i);
    //25*i =25*1=25, 25*2=50 ... 1000+i= 1000 + hojyga ac num
    myBank.addCustomer(cus);
    myBank.addAccounyNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
//bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        //viw balance
        if (service.select == "View Balance") {
            console.log("view Balance");
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)}${chalk.green.
                    italic(name?.lastName)} your Account Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }
        //cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your amount.",
                    name: "rupee"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance!"));
                }
                let newBalance = account.balance - ans.rupee;
                //calling transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //cash deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your amount.",
                    name: "rupee"
                });
                let newBalance = account.balance + ans.rupee;
                //calling transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
