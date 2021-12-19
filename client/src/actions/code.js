import piston from '../apis/piston'
import {
    OUTPUT_CHANGE
} from './types'

export const executeCode => async (dispatch, getState) => {
    const { code, language, input } = getState()
    const response = await piston.post('/execute', { code, language, input })
    dispatch({
        type: OUTPUT_CHANGE,
        payload: response.data
    })
}