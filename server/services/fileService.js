const fs = require('fs')
const File = require('../models/File')
const config = require('config')
const path = require('path');

class FileService {
    createDir(file) {
        const filePath = path.join(__dirname, `../files/${file.user}/${file.path}`)
        return new Promise(((resolve, reject) => {
            try {
              // если файл по такому пути не существует то создаем новый а если уже есть то выводим уведомление
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }
}

module.exports = new FileService()