import {API_BASE_URL} from "./constants";
import {request} from "./LoginService";

export function postProblem(problemRequest) {
    return request({
        url: API_BASE_URL + "/uploadProblem",
        method: 'POST',
        body: JSON.stringify(problemRequest)
    });
}

export function getProblems(){
    return request({
        url: API_BASE_URL + "/problems",
        method: 'GET',
    })
}

export function getSingleProblem(id){
    return request({
        url: API_BASE_URL + "/problems/" + id,
        method: 'GET',
    })
}