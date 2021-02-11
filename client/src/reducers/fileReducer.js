const SET_FILES = "SET_FILES"
const SET_CURRENT_DIR = "SET_CURRENT_DIR"
const ADD_FILE = "ADD_FILE"
const SET_POPUP_DISPLAY = "SET_POPUP_DISPLAY"
const PUSH_TO_STACK = "PUSH_TO_STACK"
const POP_FROM_STACK = "POP_FROM_STACK"
const DELETE_FILE = 'DELETE_FILE'

const defaultState = {
    files: [],
    currentDir: null,
    popupDisplay: 'none',
    dirStack: [],
    lastDir: ''
}

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES: return {...state, files: action.payload}
        case SET_CURRENT_DIR: return {...state, currentDir: action.payload}
        case ADD_FILE: return {...state, files: [...state.files, action.payload]}
        case SET_POPUP_DISPLAY: return {...state, popupDisplay: action.payload}
        case PUSH_TO_STACK:
            const updatedDir = [...state.dirStack, action.payload]
            let updatedLastDir = updatedDir.slice(-1)[0]
            return {...state, lastDir:updatedLastDir, dirStack: updatedDir }
        case POP_FROM_STACK:
            const newDir = state.dirStack.filter(item => item !== state.dirStack.slice(-1)[0])
            let newLastDir = newDir.slice(-1)[0]
            return {...state, lastDir: newLastDir, dirStack: newDir}
        case DELETE_FILE: return {...state, files: [...state.files.filter(file => file.id !== action.payload)]}
        default:
            return state
    }
}

export const setFiles = (files) => ({type: SET_FILES, payload: files})
export const setCurrentDir= (dir) => ({type: SET_CURRENT_DIR, payload: dir})
export const addFile = (file) => ({type: ADD_FILE, payload: file})
export const setPopupDisplay = (display) => ({type: SET_POPUP_DISPLAY, payload: display})
export const pushToStack = (dir) => ({type: PUSH_TO_STACK, payload: dir})
export const popFromStack = () => ({type: POP_FROM_STACK})
export const deleteFileAction = (dirId) => ({type: DELETE_FILE, payload: dirId})