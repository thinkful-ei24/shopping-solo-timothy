'use strict';

const STORE = {
    items:[
        {name: "apples", checked: false},
        {name: "oranges", checked: false},
        {name: "milk", checked: true},
        {name: "bread", checked: false}
    ],
    hideChecked: false,
    searchTerm: null,
    sortBy: 'alpha'
}
const UNORDEREDLIST = document.querySelector('.js-shopping-list');
const TEXTINPUT = document.querySelector('.js-shopping-list-entry');
const SEARCHFORM = document.querySelector('#js-search-form');
const SEARCHINPUT = document.querySelector(".js-shopping-list-search");
const CHECKBOX = document.querySelector('.display-checkbox');


const generateListElement = (item, itemIndex) => {
    return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
    `
};


function generateShoppingItemsString(shoppingList) {
  console.log(shoppingList);
  const listElements = shoppingList.map(generateListElement);
  console.log(listElements);
  return listElements.join('');
}


function renderShoppingList() {
  let filteredItems = [...STORE.items];
  if(STORE.searchTerm) {
    console.log(STORE.searchTerm);  
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().match(STORE.searchTerm.toLowerCase()));
  }
  if(STORE.hideChecked) {
    filteredItems = filteredItems.filter(item => !item.checked);
  } 
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  UNORDEREDLIST.innerHTML = shoppingListItemsString;
    // $('.js-shopping-list').html(shoppingListItemsString);
}


const addItemToShoppingList = itemName => {
    STORE.items.push({
      name: itemName, 
      checked: false
    })
};

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const itemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(itemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`)

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

const toggleHideCheckedItems = checkboxChecked => {
  console.log(`Toggled hideCompleted`)
  STORE.hideChecked = !STORE.hideChecked;
}

const handleHideCheckedItems = () => {
  //This function filters the checked items from the list when the checkbox is clicked
  console.log(`Hiding checked items`);
  CHECKBOX.addEventListener('change', event => {
    const checkBoxchecked = CHECKBOX.checked;
    toggleHideCheckedItems(checkBoxchecked);
    renderShoppingList();
  });
};

const setSearchTerm = searchTerm => STORE.searchTerm = searchTerm;

const handleItemSearch = () => {
  //This function displays matching items when the user submits a search term
  console.log('Searching item');
  SEARCHFORM.addEventListener('submit',event =>{
    event.preventDefault();
    const searchTerm = SEARCHINPUT.value;
    setSearchTerm(searchTerm);
    renderShoppingList();
  });
};

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedItems();
  handleItemSearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);