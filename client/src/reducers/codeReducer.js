import _ from 'lodash';
import {
    CODE_CHANGE,
    INPUT_CHANGE,
    OUTPUT_CHANGE,
    LANGUAGE_CHANGE
} from '../actions/types'


const initState = {
    language: 'cpp',
    code: '',
    input: '',
    output: ''
}

const codeReducer = (state = initState, action) => {
    switch (action.type) {
        case CODE_CHANGE:
            return {
                ...state,
                code: action.payload
            }
        case LANGUAGE_CHANGE:
            return {
                ...state,
                language: action.payload
            }
        case INPUT_CHANGE:
            return {
                ...state,
                input: action.payload
            }
        case OUTPUT_CHANGE:
            return {
                ...state,
                output: action.payload
            }
        default:
            return state;
    }
}

export default codeReducer;