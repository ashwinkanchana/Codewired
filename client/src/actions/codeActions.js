import codeServer from '../apis/code'
import { REQUEST_EXECUTION, UPDATE_RUN } from './types'

export const executeCode = (code, language, stdin) => async dispatch => {
    console.log('executeCode')
    dispatch({
        type: REQUEST_EXECUTION
    })
    var res = { data: [] };
    try {
        res = await codeServer.post('/execute', {
            code, language, stdin
        });
        await dispatch({
            type: UPDATE_RUN,
            payload: res.data
        })
    } catch (error) {
        //res.data = error;
        console.log(error);
    }
}