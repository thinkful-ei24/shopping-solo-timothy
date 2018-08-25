'use strict';

const STORE = {
  items:[
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false }
  ],
  hideChecked: false,
  searchTerm: null,
  indexOfItemBeingEdited: null
};

const UNORDEREDLIST = document.querySelector('.js-shopping-list');
const ADDITEMFORM = document.querySelector('#js-shopping-list-form');
const TEXTINPUT = document.querySelector('.js-shopping-list-entry');
const SEARCHFORM = document.querySelector('#js-search-form');
const SEARCHINPUT = document.querySelector('.js-shopping-list-search');
const CHECKBOX = document.querySelector('.display-checkbox');

const generateListElement = (item) => {
  const itemIndex = item.index;
  const itemIsChecked = item.checked ? 'shopping-item__checked' : '';
  const itemIsBeingEdited = itemIndex === STORE.indexOfItemBeingEdited;
  const itemElement = !itemIsBeingEdited ? 
    `<span class="shopping-item js-shopping-item ${itemIsChecked}">${item.name}</span>` :
    `<form id="edit-item-form">
        <input class="item-edit-input" type="text" required="true" value="${item.name}">
      </form>`;

  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
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
  let filteredItems = STORE.items.map((item, index) => {
    return {
      ...item, 
      index: index
    };
  });

  if(STORE.searchTerm) {
    //console.log(STORE.searchTerm);  
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().match(STORE.searchTerm.toLowerCase()));
  }
  if(STORE.hideChecked) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  // render the shopping list in the DOM
  //console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  UNORDEREDLIST.innerHTML = shoppingListItemsString;
  // $('.js-shopping-list').html(shoppingListItemsString);
};


const addItemToShoppingList = itemName => {
  STORE.items.push({
    name: itemName, 
    checked: false
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

const toggleCheckedForListItem = itemIndex => {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
};


const getItemIndexFromElement = item => {
  const itemIndexString = item.closest('.js-item-index-element').getAttribute('data-item-index');
  return parseInt(itemIndexString, 10);
};

const handleItemCheckClicked = () => {
  UNORDEREDLIST.addEventListener('click', event => {
    if(event.target.closest('button') && event.target.closest('button').classList.contains('js-item-toggle')){
      //console.log('`handleItemCheckClicked` ran');
      const itemIndex = getItemIndexFromElement(event.target);
      toggleCheckedForListItem(itemIndex);
      renderShoppingList();
    }
  });
};

// name says it all. responsible for deleting a list item.
const deleteListItem = itemIndex => {
  //console.log(`Deleting item at index  ${itemIndex} from shopping list`)

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
};

const handleDeleteItemClicked = () => {
  // like in `handleItemCheckClicked`, we use event delegation
  UNORDEREDLIST.addEventListener('click', event => {
    if(event.target.closest('button') && event.target.closest('button').classList.contains('js-item-delete')){
      // get the index of the item in STORE
      const itemIndex = getItemIndexFromElement(event.target);
      // delete the item
      deleteListItem(itemIndex);
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
  //console.log('Hiding checked items');
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

const toggleItemIsBeingEdited = itemIndex => {
  //This function toggles the isBeingEdited property on the specified object in the Store
  //console.log('item is being edited');
  STORE.indexOfItemBeingEdited = itemIndex;
};

const handleClickItemName = () => {
  //This function handles when user clicks on an item in the list
  UNORDEREDLIST.addEventListener('click', event => {
    // console.log('item is being edited');
    if(event.target.classList.contains('shopping-item')){
      const itemIndex = getItemIndexFromElement(event.target);
      toggleItemIsBeingEdited(itemIndex);
      renderShoppingList();
      handleEditItemName();
    }
  });
};

const editItemName = (itemIndex, newItemName) => {
  STORE.items[itemIndex].name = newItemName;
  STORE.indexOfItemBeingEdited = null;
};  

const handleEditItemName = () => {
  // This edits the name of the item in the list
  const editItemForm = document.querySelector('#edit-item-form');
  if(!editItemForm) return;
  editItemForm.addEventListener('submit', event => {
    event.preventDefault();
    const editInput = editItemForm.querySelector('input');
    const newItemName = editInput.value;
    const itemIndex = getItemIndexFromElement(editInput);
    editItemName(itemIndex, newItemName);
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