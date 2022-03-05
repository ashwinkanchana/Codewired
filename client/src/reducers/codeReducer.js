import _ from 'lodash';
import {
    UPDATE_LANGUAGE,
    UPDATE_CODE,
    UPDATE_STDIN,
    UPDATE_RUN,
    REQUEST_EXECUTION
} from '../actions/types'

const initState = {
    language: 'python',
    code: `
for i in range(0, 5):
    for j in range(0, i+1):
        print("* ",end="")
    print("\\r")`,
    stdin: 'test',
    is_executing: false,
    run: {
        stdout: '',
        stderr: '',
        code: 0,
        signal: null,
        output: ''
    }
}

const codeReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_CODE:
            return {
                ...state,
                code: action.payload
            }
        case UPDATE_LANGUAGE:
            return {
                ...state,
                language: action.payload
            }
        case UPDATE_STDIN:
            return {
                ...state,
                stdin: action.payload
            }
        case UPDATE_RUN:
            return {
                ...state,
                is_executing: false,
                run: action.payload
            }
        case REQUEST_EXECUTION:
            return {
                ...state,
                is_executing: true
            }
        default:
            return state;
    }
}
export default codeReducer;