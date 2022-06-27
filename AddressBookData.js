class AddressBookData {
    id;
    
    get text(){return this._text;}
    set text(text){
            this._text =text;
    }

    get address() {return this._address;}
    set address(address) {
        this._address = address;
    }

    get city() {return this._city;}
    set city(city) {
        this._city = city;
    }

    
    get state() {return this._state;}
    set state(state) {
        this._state = state;
    }

    get zip() {return this._zip;}
    set zip(zip) {
        this._zip = zip;
    }

    get number() {return this._number;}
    set number(number) {
        this._number = number;
    }

    toString() {
        const options = {year : 'numeric', month : 'long', day : 'numeric' };
        const empDate = !this.startDate ? "undefined" :
                        this.startDate.toLocalDateString("en-US", options);
        return "id="+ this.id + ", Name = "+this.text+", address = "+this.address+", city = "+this.city+
        ", state = "+this.state+", zip = "+this.zip+", number = "+this.number;
    }
}