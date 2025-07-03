import axios from "axios"

const SERVER_URL = "https://studies.cs.helsinki.fi/restcountries/api/"

const getAllCountries = () => {
    return axios.get(`${SERVER_URL}/all`)
                .then(res => res.data)
}

export default {
    getAllCountries,
}