const fs = require('fs')
const File = require('../models/File')
const path = require('path');

class FileService {

  createDir(file) {
      const filePath = path.join(__dirname, `../files/${file.user}/${file.path}`)
      return new Promise(((resolve, reject) => {
        try {
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath)
                return resolve({message: 'File was created'})
            } else {
                return reject({message: "File already exist"})
            }
        } catch (e) {
            console.log(e)
            return reject({message: 'File error'})
        }
    }))
  }

  deleteFile(file) {
      const filePath = path.join(__dirname, `../files/${file.user}/${file.path}`)
      // в модула fs за удаление папок и файлов отвечают разные функции поэтому зделаем проверку
      console.log(filePath)
      if (file.type === 'dir') {
          fs.rmdirSync(filePath)
      } else {
          fs.unlinkSync(filePath)
      }
  }
}


module.exports = new FileService()