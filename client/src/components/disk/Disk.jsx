import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFiles, uploadFile} from "../../actions/file";
import FileList from "./fileList/FileList";
import './disk.scss'
import Popup from './Popup';
import {setPopupDisplay, setCurrentDir, popFromStack} from "../../reducers/fileReducer";
import Uploader from './uploader/Uploader';
import { setFileView } from '../../reducers/appReducer';



const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const lastDir = useSelector(state => state.files.lastDir)
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')
    const [sortDirection, setsortDirection] = useState('disk__select_sort-direction')
    const [direction, setDirection] = useState('down')
    const loader = useSelector(state => state.app.loader)

    useEffect(() => {
        dispatch(getFiles(currentDir, sort))
    }, [dispatch, currentDir, sort])

    const sortHelpHendler = () => {
      setDirection(direction === 'down' ? 'up' : 'down')
      setsortDirection(sortDirection === 'disk__select_sort-direction' ? 'disk__select_sort-direction active' : 'disk__select_sort-direction')
    }

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

    if(loader) {
      return (
          <div className="loader">
              <div className="lds-dual-ring"></div>
          </div>
        )
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
                <div className='disk__select'>
                  <button className={sortDirection} onClick={() => sortHelpHendler()}/>
                  <select value={sort}
                              onChange={(e) => setSort(e.target.value)}
                              >
                      <option value="name">По имени</option>
                      <option value="type">По типу</option>
                      <option value="date">По дате</option>
                  </select>
                </div>
                <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))}/>
                <button className="disk__list" onClick={() => dispatch(setFileView('list'))}/>
            </div>
            <FileList
              sort={sort}
              direction={direction}
            />
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