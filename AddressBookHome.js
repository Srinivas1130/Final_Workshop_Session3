let addressBookList;
window.addEventListener('DOMContentLoaded', (event) => {
    if(site_properties.use_local_storage.match("true")){
        getAddressBookDataFromStorage();
    } else getAddressBookDataFromServer();
    addressBookList = getAddressBookDataFromStorage();
    
});

const getAddressBookDataFromStorage = () => {
    addressBookList = localStorage.getItem('AddressBookList') ?        
                        JSON.parse(localStorage.getItem('AddressBookList')) : [];
    processAddressBookDataResponse();
}

const processAddressBookDataResponse = () => {
    document.querySelector(".contact-count").textContent = addressBookList.length;
    createInnerHtml();
    localStorage.removeItem('editPer');
}

const getAddressBookDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
    .then(responseText => {
        addressBookList = JSON.parse(responseText);
        processAddressBookDataResponse();
    })
    .catch(error => {
        console.log("GET Error status: "+JSON.stringify(error));
        addressBookList = [];
        processAddressBookDataResponse();
    });
}

const createInnerHtml = () => {
    if (addressBookList.length == 0) return;
    const headerHtml = "<th>Name</th><th>Address</th><th>City</th>"+
                        "<th>State</th><th>Zip</th><th>Phone Number</th><th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    for (const addressBookData of addressBookList){
        innerHtml = `${innerHtml}
            <tr>
                <td>${addressBookData._text}</td>
                <td>${addressBookData._address}</td>
                <td>${addressBookData._city}</td>
                <td>${addressBookData._state}</td>
                <td>${addressBookData._zip}</td>
                <td>${addressBookData._number}</td>
                <td>
                <img id="${addressBookData.id}" onclick="remove(this)" src="../Assets/assets/icons/delete-black-18dp.svg" alt="delete">
                <img id="${addressBookData.id}" onclick="update(this)" src="../Assets/assets/icons/create-black-18dp.svg" alt="edit">
                 </td>
            </tr>
    `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml ;
}

const remove = (node) => {
    let addressBookData = addressBookList.find(perData => perData.id == node.id);
    if(!addressBookData) return;
    const index = addressBookList   
                  .map(perData => perData.id)
                  .indexOf(addressBookData.id);
    addressBookList.splice(index, 1);
    if(site_properties.use_local_storage.match("true")) {
    localStorage.setItem("AddressBookList", JSON.stringify(addressBookList));
    document.querySelector(".contact-count").textContent = addressBookList.length;
    createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + addressBookData.id.toString();
        makeServiceCall("DELETE", deleteURL, false)
        .then (responseText => {
            createInnerHtml();
        })
        .catch(error => {
            console.log("DELETE Error Status: "+JSON.stringify(error));
        });
    }
} 

const update = (node) => {
    let addressBookData = addressBookList.find(perData => perData.id == node.id)
    if (!addressBookData) return;
    localStorage.setItem('editPer', JSON.stringify(addressBookData))
    window.location.replace(site_properties.add_emp_payroll_page);
}