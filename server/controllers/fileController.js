const fs = require('fs')
const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const path = require('path');
const Uuid = require('uuid')

class FileController {
  async createDir(req, res) {
      try {
          const {name, type, parent} = req.body
          const file = new File({name, type, parent, user: req.user.id})
          const parentFile = await File.findOne({_id: parent})
          if(!parentFile) {
              file.path = name
              await fileService.createDir(file)
          } else {
              file.path = `${parentFile.path}\\${file.name}`
              await fileService.createDir(file)
              parentFile.childs.push(file._id)
              await parentFile.save()
          }
          await file.save()
          return res.json(file)
      } catch (e) {
          console.log(e)
          return res.status(400).json(e)
      }
  }

  async getFiles(req, res) {
      try {
          const {sort} = req.query
          let files
          switch (sort) {
              case 'name':
                  files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name:1})
                  break
              case 'type':
                  files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type:1})
                  break
              case 'date':
                  files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date:1})
                  break
              default:
                  files = await File.find({user: req.user.id, parent: req.query.parent})
                  break;
          }
          return res.json(files)
      } catch (e) {
          console.log(e)
          return res.status(500).json({message: "Can not get files"})
      }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file

      const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
      const user = await User.findOne({_id: req.user.id})

      // если занятое на диске место + размер файла больше чем размер диска то на диске нет свободного места
      if(user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({message: 'There no space on the disk'})
      }

      // прибавляем размер файла к текущей заполнености диска
      user.usedSpace = user.usedSpace + file.size
      //в путь добавляем родителя если есть
      let filePath
      if(parent) {
        filePath = path.join(__dirname, `../files/${user._id}/${parent.path}/${file.name}`)
      } else {
        filePath = path.join(__dirname, `../files/${user._id}/${file.name}`)
      }
      // проверяем есть ли файл с таким названием по такому пути
      if(fs.existsSync(filePath)) {
        return res.status(400).json({message: 'File already exist'})
      }
      // перенесем файл по ранее созданому пути
      file.mv(filePath)

      //разделим страку по точкам и заберем самое последнее
      const type = file.name.split('.').pop()

      let pathForFile = file.name
      if (parent) {
        pathForFile = parent.path + '/' + file.name
      }
      // создадим модель файла для базы данных // ?. - синтаксис который  проверяет на наличее того что после точки и если нет то не будет запрашивать
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: pathForFile,
        parent: ( parent === null || parent === undefined) ? undefined : parent._id,
        user: user._id
    })

    await dbFile.save()
    await user.save()

    res.json(dbFile)

    } catch(e) {
      console.log(e)
      return res.status(500).json({message: "Upload error"})
    }
  }

  //скачивание файла с сервера
  async downloadFile(req, res) {
      try {
          const file = await File.findOne({_id: req.query.id, user: req.user.id})
          const filePath = path.join(__dirname, `../files/${req.user.id}/${file.path}`)
          if (fs.existsSync(filePath)) {
              return res.download(filePath, file.name)
          }
          return res.status(400).json({message: "Download error"})
      } catch (e) {
          console.log(e)
          res.status(500).json({message: "Download error"})
      }
  }

  // удаление файла
  async deleteFile(req, res) {
    try {
        const file = await File.findOne({_id: req.query.id, user: req.user.id})
        if (!file) {
            return res.status(400).json({message: 'file not found'})
        }
        fileService.deleteFile(file)
        await file.remove()
        return res.json({message: 'File was deleted'})
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Dir is not empty'})
    }
  }

  async searchFile(req, res) {
    try {
        const searchName = req.query.search
        let files = await File.find({user: req.user.id})
        files = files.filter(file => file.name.includes(searchName))
        return res.json(files)
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Search error'})
    }
  }

  // загрузка аватара на сервер
  async uploadAvatar(req, res) {
    try {
        const file = req.files.file
        const user = await User.findById(req.user.id)
        const avatarName = Uuid.v4() + ".jpg"
        const avatarPath = path.join(__dirname, `../static/${avatarName}`)
        file.mv(avatarPath)
        user.avatar = avatarName
        await user.save()
        return res.json(user)
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Upload avatar error'})
    }
  }

  async deleteAvatar(req, res) {
    try {
        const user = await User.findById(req.user.id)
        const avatarPath = path.join(__dirname, `../static/${user.avatar}`)
        fs.unlinkSync(avatarPath)
        user.avatar = null
        await user.save()
        return res.json(user)
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: 'Delete avatar error'})
    }
  }
}

module.exports = new FileController()