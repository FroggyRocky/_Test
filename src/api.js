import axios from "axios"
// baseURL: 'http://localhost:3001/api/',
// baseURL: 'https://danila-test-market.herokuapp.com/api/'
const instance = axios.create({
    baseURL: 'https://danila-test-market.herokuapp.com/api/'
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

        return fetch("https://api.apilayer.com/fixer/latest?symbols=RUB&base=USD", requestOptions)
            .then(response => { return response.json() })
            .then(data => data)
            .catch(error => console.log('error', error));
    },
    async buy(items) {
        return instance.post('buy-items', items)
    }

}


