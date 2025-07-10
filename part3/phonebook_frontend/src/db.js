import axios from "axios"

const SERVER_URL = "/api/persons"

const getAllPerson = () => {
    return axios.get(SERVER_URL)
                .then(res => res.data)
}

const addPerson = (name, number) => {
    return axios.post(SERVER_URL, {name, number})
                .then(res => res.data)
}

const deletePerson = (id) => {
    return axios.delete(`${SERVER_URL}/${id}`).then(res => res.data)
}

const changePerson = (person) => {
    return axios.put(`${SERVER_URL}/${person.id}`, person).then(res => res.data)
}

export default {
    getAllPerson,
    addPerson,
    deletePerson,
    changePerson,
}