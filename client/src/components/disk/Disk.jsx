import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFiles} from "../../actions/file";
import FileList from "./fileList/FileList";
import './disk.scss'
import Popup from './Popup';
import {setPopupDisplay} from "../../reducers/fileReducer";
import { setCurrentDir } from './../../reducers/fileReducer';

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const lastDir = useSelector(state => state.files.lastDir)

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [dispatch, currentDir])

    function showPopupHandler() {
      dispatch(setPopupDisplay('flex'))
    }

    const backClickHandler = () => {
      dispatch(setCurrentDir(lastDir))
    }


    return (
        <div className="disk">
            <div className="disk__btns">
            {currentDir && <button className="disk__back" onClick={()=> backClickHandler()}>Back</button>}
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
            </div>
            <FileList/>
            <Popup/>
        </div>
    );
};

export default Disk;