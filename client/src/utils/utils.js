import axios from 'axios'


export const codeServer = axios.create({
    baseURL: 'http://localhost:4001/code'
})

export const getBaseURL = () => {
    let url;
    if (process.env.REACT_APP_ENV === 'development') {
        url = process.env.REACT_APP_DEV_API_URL;
    }
    if (process.env.REACT_APP_ENV === 'production') {
        url = process.env.REACT_APP_PROD_API_URL;
    }
    return url;
}


export const getPeerConfig = () => {
    let host, port;
    if (process.env.REACT_APP_ENV === 'development') {
        host = process.env.REACT_APP_DEV_PEER_HOST;
        port = process.env.REACT_APP_DEV_PEER_PORT;
    }
    if (process.env.REACT_APP_ENV === 'production') {
        host = process.env.REACT_APP_PROD_PEER_HOST;
        port = process.env.REACT_APP_PROD_PEER_PORT;
    }
    return { host, port };
}