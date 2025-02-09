import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-9c7b7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Add item when Enter key is pressed
inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && inputFieldEl.value.trim()) {
        addItem();
    }
});

addButtonEl.addEventListener("click", function() {
    if (inputFieldEl.value.trim()) {
        addItem();
    }
});

function addItem() {
    const inputValue = inputFieldEl.value.trim();
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
    
    // Add button click animation
    addButtonEl.style.transform = "scale(0.95)";
    setTimeout(() => {
        addButtonEl.style.transform = "scale(1)";
    }, 100);
}

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            appendItemToShoppingListEl(itemsArray[i])
        }
    } else {
        shoppingListEl.innerHTML = '<div class="empty-message">No items here... yet</div>'
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        // Add removal animation
        newEl.style.transform = "scale(0.9) translateY(10px)";
        newEl.style.opacity = "0";
        
        setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
            remove(exactLocationOfItemInDB)
        }, 300);
    })
    
    shoppingListEl.append(newEl)
}