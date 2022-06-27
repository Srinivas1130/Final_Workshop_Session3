let isUpdate = false;
let addressBookObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
    const text = document.querySelector('#text');
    text.addEventListener('input', function () {
        if(text.value.length == 0) {
            setTextValue('.text-error',"")
            return;
        }
        try {
            (new AddressBookData()).text = text.value;
            setTextValue('.text-error',"")
        } catch (e) {
            setTextValue('.text-error',e)
        }
    });
    checkForUpdate();
});

const checkForUpdate = () => {
    const addressBookJson = localStorage.getItem('editPer');
    isUpdate = addressBookJson ? true : false ;
    if (!isUpdate) return ;
    addressBookObj = JSON.parse(addressBookJson);
    setForm();
}

const setForm = () => {
    setvalue('#text', addressBookObj._text);
    setvalue('#address', addressBookObj._address);
    setvalue('#city', addressBookObj._city);
    setvalue('#state', addressBookObj._state);
    setvalue('#zip', addressBookObj._zip);
    setvalue('#number', addressBookObj._number);

}

const setvalue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const save = (event) => {
    try {
        setAddressBookObject();
        if (site_properties.use_local_storage.match("true")){
            createAndUpdateStorge();
            resetForm();
            window.location.replace(site_properties.home_page);  
        } else {
            createOrUpdateAddressBook();
        }
    } catch (e){
    return;
    }
}

const createOrUpdateAddressBook = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST"
    if(isUpdate) {
        methodCall = "PUT"
        postURL = postURL + addressBookObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, addressBookObj)
    .then(responseText => {
        resetForm();
        window.location.replace(site_properties.home_page);
    })
    .catch( error => {
        throw error;
    });
}

const setAddressBookObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")){
        addressBookObj.id = createNewPersonId();
    }
    addressBookObj._text = getInputValueById('#text');
    addressBookObj._address = getInputValueById('#address');
    addressBookObj._city = getInputValueById('#city');
    addressBookObj._state = getInputValueById('#state');
    addressBookObj._zip = getInputValueById('#zip');
    addressBookObj._number = getInputValueById('#number');
}

const createAndUpdateStorge = () => {
    let addressBookList = JSON.parse(localStorage.getItem("AddressBookList"));
    if(addressBookList){
        let addressBookData = addressBookList.
                             find(perData => perData.id == addressBookObj.id);
        if(!addressBookData) {
            addressBookList.push(addressBookObj());
        } else {
            const index = addressBookList
                          .map(perData => perData.id)
                          .indexOf(addressBookData.id);
            addressBookList.splice(index,1, addressBookObj);
        }
    } else {
        addressBookList = [addressBookObj]
    }
    localStorage.setItem("AddressBookList", JSON.stringify(addressBookList))
}

const resetForm = () => {
    setvalue('#text','');
    setvalue('#address','');
    setvalue('#city','');
    setvalue('#state','');
    setvalue('#zip','');
    setvalue('#number','');
}


const createNewPersonId = () => {
    let perID = localStorage.getItem("PersonID");
    perID = !perID ? 1 : (parseInt(perID)+1).toString();
    localStorage.setItem("PersonID", perID);
    return perID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}

const createAddressBook = () => {
    let addressBookData = new AddressBookData();
        addressBookData.text = getInputValueById('#text');
        addressBookData.address = getInputValueById('#address');
        addressBookData.city = getInputValueById('#city');
        addressBookData.state = getInputValueById('#state');
        addressBookData.zip = getInputValueById('#zip');
        addressBookData.number = getInputValueById('#number');
    alert(addressBookData.toString());
    return addressBookData;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}