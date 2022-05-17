import axios from "axios"


const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
})


export const UserAPI = {

    async getItems() {
        return instance.get('get-items')
    },
    async getCurrencyRate() {
        var myHeaders = new Headers();
        myHeaders.append("apikey", "l64XSGxFINCnH5hEFNHDbtYfw32Qo8dc");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        return fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=RUB&base=USD", requestOptions)
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.log('error', error));
    },
    async buy(items) {
        return instance.post('buy-items', items)
    }

}


