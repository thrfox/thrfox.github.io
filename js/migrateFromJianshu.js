/**
 * Node Js 从简书导出后，迁移文章
 * 导出的文章放入 _post/migrateFromJianshu
 * 根路径执行 node js/migrateFromJianshu
 */
const fs = require('fs')
const path = require('path')

const header = [
  '---',
  'layout: post',
  'title: ${title}',
  'subtitle: 简书迁移',
  'author: "thrfox"',
  'header-style: text',
  'tags:',
  '  - ${tags}',
  '---',
  ''
]

//调用文件遍历方法
const exportedPost = fileDisplay('./_posts/migrateFromJianshu')

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            var isFile = stats.isFile() //是文件
            var isDir = stats.isDirectory() //是文件夹
            if (isFile) {
              opertion(filePath, filedir, filename)
            }
            if (isDir) {
              fileDisplay(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}

function opertion(filePath, filedir, filename) {
  const data = appendHeader(filePath, filedir,filename)

  const date = new Date()
  const dateStr = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()}-${date.getDate().toString()}`
  fs.writeFileSync(`${filePath}/${dateStr}-${filename}`, data, 'utf-8')
  // remote sourceFile
  fs.unlinkSync(filedir)
}

function appendHeader(filePath,filedir, filename) {
  const directory = filePath.slice(filePath.lastIndexOf('\\') + 1, filePath.length)
  const file = fs.readFileSync(filedir, 'utf-8')
  const data = file.split('\n')
  data.unshift(...header.map(line => line.replace('${title}', filename).replace('${tags}', directory)))
  return data.join('\n')
}

function replaceHeader() {}
