'use strict';

//Found this unique id generator from searching Google
//The source is https://gist.github.com/gordonbrander/2230317
var uniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const STORE = {
  items:[
    {name: 'apples', checked: false, id: uniqueId()},
    {name: 'oranges', checked: false, id: uniqueId()},
    {name: 'milk', checked: true, id: uniqueId()},
    {name: 'bread', checked: false, id: uniqueId()}
  ],
  hideChecked: false,
  searchTerm: null,
  idOfItemBeingEdited: null
};

const UNORDEREDLIST = document.querySelector('.js-shopping-list');
const ADDITEMFORM = document.querySelector('#js-shopping-list-form');
const TEXTINPUT = document.querySelector('.js-shopping-list-entry');
const SEARCHFORM = document.querySelector('#js-search-form');
const SEARCHINPUT = document.querySelector('.js-shopping-list-search');
const CHECKBOX = document.querySelector('.display-checkbox');

const generateListElement = (item) => {
  const itemIsChecked = item.checked ? 'shopping-item__checked' : '';
  const itemIsBeingEdited = item.id === STORE.idOfItemBeingEdited;
  const itemElement = !itemIsBeingEdited ? 
    `<span class="shopping-item js-shopping-item ${itemIsChecked}">${item.name}</span>` :
    `<form id="edit-item-form">
        <input class="item-edit-input" type="text" required="true" value="${item.name}" pattern="[a-zA-Z]+">
      </form>`;

  return `
    <li class="js-item-id-element" data-item-id="${item.id}">
      ${itemElement}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
    `;
};


const generateShoppingItemsString = shoppingList => {
  const listElements = shoppingList.map(generateListElement);
  return listElements.join('');
};

const renderShoppingList = () => {
  let filteredItems = STORE.items;

  if(STORE.searchTerm) {
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().match(STORE.searchTerm.toLowerCase()));
  }
  if(STORE.hideChecked) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  UNORDEREDLIST.innerHTML = shoppingListItemsString;
};


const addItemToShoppingList = itemName => {
  STORE.items.push({
    name: itemName, 
    checked: false,
    id: uniqueId()
  });
};

const handleNewItemSubmit = () => {
  ADDITEMFORM.addEventListener('submit', event => {
    event.preventDefault();
    const itemName = TEXTINPUT.value;
    TEXTINPUT.value = '';
    addItemToShoppingList(itemName);
    renderShoppingList();
  });
};

const toggleCheckedForListItem = itemId => {
  const checkedItem = STORE.items.find(item => item.id === itemId);
  checkedItem.checked = !checkedItem.checked;
};


const getItemIdFromElement = item => {
  const itemIdString = item.closest('.js-item-id-element').getAttribute('data-item-id');
  return itemIdString;
};

const handleItemCheckClicked = () => {
  UNORDEREDLIST.addEventListener('click', event => {
    if(event.target.closest('button') && event.target.closest('button').classList.contains('js-item-toggle')){
      //console.log('`handleItemCheckClicked` ran');
      const itemId = getItemIdFromElement(event.target);
      toggleCheckedForListItem(itemId);
      renderShoppingList();
    }
  });
};

// name says it all. responsible for deleting a list item.
const deleteListItem = itemId => {
  if(itemId === STORE.idOfItemBeingEdited) STORE.idOfItemBeingEdited = null;
  STORE.items = STORE.items.filter(item => item.id !== itemId);
};

const handleDeleteItemClicked = () => {
  // like in `handleItemCheckClicked`, we use event delegation
  UNORDEREDLIST.addEventListener('click', event => {
    if(event.target.closest('button') && event.target.closest('button').classList.contains('js-item-delete')){
      // get the id of the item in STORE
      const itemId = getItemIdFromElement(event.target);
      // delete the item
      deleteListItem(itemId);
      // render the updated shopping list
      renderShoppingList();
    }
  });
};

const toggleHideCheckedItems = checkboxChecked => {
  //console.log('Toggled hideCompleted')
  STORE.hideChecked = checkboxChecked;
};

const handleHideCheckedItems = () => {
  //This function filters the checked items from the list when the checkbox is clicked
  CHECKBOX.addEventListener('change', () => {
    const checkBoxchecked = CHECKBOX.checked;
    toggleHideCheckedItems(checkBoxchecked);
    renderShoppingList();
  });
};

const setSearchTerm = searchTerm => STORE.searchTerm = searchTerm;

const handleItemSearch = () => {
  //This function displays matching items when the user submits a search term
  //console.log('Searching item');
  SEARCHFORM.addEventListener('submit',event =>{
    event.preventDefault();
    const searchTerm = SEARCHINPUT.value;
    setSearchTerm(searchTerm);
    renderShoppingList();
  });
};

const toggleItemIsBeingEdited = itemId => {
  //This function toggles the isBeingEdited property on the specified object in the Store
  //console.log('item is being edited');
  STORE.idOfItemBeingEdited = itemId;
};

const handleClickItemName = () => {
  //This function handles when user clicks on an item in the list
  UNORDEREDLIST.addEventListener('click', event => {
    // console.log('item is being edited');
    if(event.target.classList.contains('shopping-item')){
      const itemId = getItemIdFromElement(event.target);
      toggleItemIsBeingEdited(itemId);
      renderShoppingList();
      handleEditItemName();
    }
  });
};

const editItemName = (itemId, newItemName) => {
  STORE.items.find(item => item.id === itemId).name = newItemName;
  STORE.idOfItemBeingEdited = null;
};  

const handleEditItemName = () => {
  // This edits the name of the item in the list
  const editItemForm = document.querySelector('#edit-item-form');
  if(!editItemForm) return;
  editItemForm.addEventListener('submit', event => {
    event.preventDefault();
    const editInput = editItemForm.querySelector('input');
    const newItemName = editInput.value;
    const itemId = getItemIdFromElement(editInput);
    editItemName(itemId, newItemName);
    renderShoppingList(); 
  });
};

const clearSearchResults = () => {
  STORE.searchTerm = null;
};

const handleClearSearchResults = () => {
  //This function handles clearing search results
  document.querySelector('.js-clear-search-button').addEventListener('click', ()=> {
    clearSearchResults();
    SEARCHINPUT.value = '';
    renderShoppingList();
  });
};

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
const handleShoppingList = () => {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedItems();
  handleItemSearch();
  handleClickItemName();
  handleClearSearchResults();
};

// when the page loads, call `handleShoppingList`
document.addEventListener('DOMContentLoaded', handleShoppingList);