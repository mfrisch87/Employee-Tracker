const db = require("./db");
const inquirer = require("inquirer");
const q = require("./lib/questions.js");

const start  = async () => {
    console.clear()
    try{
        const getAllTAbles = await db.getCombinedTables();
        console.log(getAllTAbles.length)
        if(getAllTAbles.length === 0){
            console.log("\x1b[31m Looks like your employee list is empty, you must add a department then a role before adding a employee")
        }else{
            console.table(getAllTAbles)
        }
        
        initialContact()
    }catch(err){
        console.error(err);
    }
}

const initialContact = async() =>{  
    const {action} = await promptUser(q.WhatWouldYouLikeToDo());

    switch (action) {
        case "ADD_EMPLOYEE":
            addEmployee();
            break;
  
        case "ADD_DEPARTMENT":
            addDepartment();
            break;
  
        case "ADD_ROLE":
            addRole();
            break;
        case "VIEW_EMPLOYEE":
        case "VIEW_ROLE":
        case "VIEW_DEPARTMENT":
            if(action == "VIEW_EMPLOYEE") {
                start() 
                break;
            };
            viewTable(action.split("_").pop().toLowerCase());
            break;
        case "VIEW_EMPLOYEE_BY_MANAGER":
            viewEmpByMan();
            break;

        case "CHANGE_EMPLOYEEs_ROLE":
            updateEmployeeRoles();
            break; 

        case "CHANGE_EMPLOYEEs_MANAGER":
            updateEmpManager();
            break;
            
        case "REMOVE_EMPLOYEE":
            removeEmployee();
            break; 

        case "REMOVE_DEPARTMENT":
            removeDepartment();
            break;

        case "REMOVE_ROLE":
            removeRoles();
            break;

        case "DEPARTMENT_BUDGET":
            budget();
            break                   
            
        default:
              db.endConnection();
            break;
        }
    

}

const addEmployee = async () =>{
    let{firstName, lastName, roleId, manager} = await promptUser(q.askEmployeeQ());
    if(manager === "null")manager = null;
    removeOrAddAll("employee",
            {
                id_role: roleId,
                first_name: firstName,
                last_name: lastName,
                manager_id:manager
            },db.addAll);      
}

const addRole = async () => {
    const{id,title,salary} = await promptUser(q.askRoleQ());
    
    removeOrAddAll("role",
            {
                department_id: id,
                title: title,
                salary: salary,
            },db.addAll);
}

const addDepartment = async () =>{
    const{deptName} = await promptUser(q.askDepartmentQ());

    removeOrAddAll("department",
            {
                department_name: deptName,
            },db.addAll);      
}

const updateEmployeeRoles = async  () =>{
    let {emp, roleId} = await promptUser(q.employeeRoleQ())
    if(emp === "null"){
        console.clear()
        initialContact();
    }else{
        updateAll([{ id_role: roleId},{employee_id: emp}]);
    }
}

const updateEmpManager = async () =>{
    let {emp, manager} = await promptUser(q.changeManager())
    if(emp === "null" ){
        console.clear()
        initialContact();
    }else{
        if(manager === "null")manager = null;
        updateAll([{manager_id: manager},{employee_id: emp}]);
    }  
}

const budget = async () =>{
    const{id} = await promptUser(q.departmentList());
    try{
        const budgetTable = await db.budget(id);
        console.clear()
        console.table(budgetTable)
        initialContact();
        
    }catch(err){
        console.error(err);
    }

}

const removeDepartment = async () =>{

    if (!deleting()){
        console.clear()
        initialContact()
    }else{
        const{id} = await promptUser(q.departmentList());
        removeOrAddAll("department",{department_id: id,},db.removeAll);
    }
}

const removeRoles = async () =>{

    if (!deleting()){
        console.clear()
        initialContact()
    }else{
        const{roleId} = await promptUser(q.roleList());

        removeOrAddAll("role",{ id_role: roleId },db.removeAll);
    };
} 
const removeEmployee = async () =>{
    if (!deleting()){
        console.clear()
        initialContact()
    }else{
        let{emp} = await promptUser(q.employeeList());
        if(emp === "null"){
            console.clear()
            initialContact()
        }else{
            removeOrAddAll("employee",{ employee_id: emp },db.removeAll);
        }  
    }
} 

const viewEmpByMan = async () =>{
    let m = await db.getManager();
    if(m.length !== 0){
        const{manager} = await promptUser(q.askForWhatManager());
        try{
            const empByMan = await db.getTableEmployeeByManager(manager);
            console.clear()
            console.table(empByMan);
            initialContact();
        }catch(err){
            console.error(err);
        }
    }else{
        console.error("\x1b[31m No Managers Available")
        start();
    }
    
}


const viewTable = async (tableName) =>{
    const table = await db.getAllTables(tableName)
    console.clear()
    console.table(table);
    initialContact();

}
const promptUser = (question) =>{
    return inquirer
        .prompt(question);
}

const deleting = async () =>{
    const{answer} = await promptUser(q.deleting())
        return answer
}

const removeOrAddAll = async (tableName,object,actionFunction) =>{
    try{
        const c = await actionFunction(
            [
                tableName,
                object
            ]
        );
        console.log(c.affectedRows + " product inserted!\n")
        if(tableName === "employee"){
            start()
        }else{
            console.clear()
            viewTable(tableName);
        }
        

    }catch(err){
        console.error(err);
    }
}

const updateAll = async  (arrayOfObject) =>{
    try{
        const c = await db.changeAll(arrayOfObject);
        console.log(c.affectedRows + " product inserted!\n")
        start();
    }catch(err){
        console.error(err);
    }
}

start();