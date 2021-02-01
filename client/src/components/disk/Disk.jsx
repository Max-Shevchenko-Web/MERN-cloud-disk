import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFiles, uploadFile} from "../../actions/file";
import FileList from "./fileList/FileList";
import './disk.scss'
import Popup from './Popup';
import {setPopupDisplay, setCurrentDir, popFromStack} from "../../reducers/fileReducer";
import Uploader from './uploader/Uploader';

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const lastDir = useSelector(state => state.files.lastDir)
    const [dragEnter, setDragEnter] = useState(false)

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [dispatch, currentDir])

    function showPopupHandler() {
      dispatch(setPopupDisplay('flex'))
    }

    const backClickHandler = () => {
      dispatch(setCurrentDir(lastDir))
      dispatch(popFromStack())
    }

    function fileUploadHandler(event) {
      // получаем все файлы из импута
      const files = [...event.target.files]
      // проитерируемся по каждому файлу и для каждого вызовем uploadFile
      files.forEach(file => dispatch(uploadFile(file, currentDir)))
    }

    function dragEnterHandler(event) {
      event.preventDefault()
      event.stopPropagation()
      setDragEnter(true)
    }

    function dragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }


    return ( !dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={() => dragLeaveHandler()} onDragOver={dragEnterHandler}>
            <div className="disk__btns">
                {currentDir && <button className="disk__back" onClick={()=> backClickHandler()}>Back</button>}
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                <div className="disk__upload">
                  <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                  <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                </div>
            </div>
            <FileList/>
            <Popup/>
            <Uploader/>
        </div>
        :
        <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            Перетащите файлы сюда
        </div>
    )
}

export default Disk;