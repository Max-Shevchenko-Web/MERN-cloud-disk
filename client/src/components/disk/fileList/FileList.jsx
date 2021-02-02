import React from 'react';
import './fileList.scss'
import {useSelector} from "react-redux";
import File from "./file/File";
import {CSSTransition, TransitionGroup} from "react-transition-group"

const FileList = () => {

  const files = useSelector(state => state.files.files)
  const fileView = useSelector(state => state.app.view)


  if (files.length === 0) {
      return (
          <div className='loader'>Файлы не найдены</div>
      )
  }

  // отображаем списком
  if(fileView === 'list') {
    return (
        <div className='filelist'>
            <div className="filelist__header">
                <div className="filelist__name">Название</div>
                <div className="filelist__date">Дата</div>
                <div className="filelist__size">Размер</div>
            </div>
            <TransitionGroup>
                {files.map(file =>
                    <CSSTransition
                      key={file.id}
                      timeout={500}
                      className={'file'}
                      exit={false}
                    >
                      <File  file={file}/>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
  }

  if (fileView === "plate") {
    return (
        <div className='fileplate'>
            {files.map(file =>
                <File key={file.id} file={file}/>
            )}
        </div>
    )
  }
};

export default FileList;