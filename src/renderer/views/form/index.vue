<template>
  <div class="app-container"> 
    <el-form ref="form" label-width="120px" class="form-prop">
      <el-row>
      <el-col :span="12" class="demo-col span-prop">
          <file-upload
            ref="upload1"
            post-action="/post.method"
            input-id="file1"
            :directory="infile.inputDirMode"
            :multiple="true"
            @input-file="inputFile">
             <img class="img-prop" src="./../../assets/upload.png" height="40">
            <div class="div-prop">{{this.infile.filenameOne|formatName}}</div>
          </file-upload>
      </el-col>
      <el-col :span="12" class="demo-col span-prop span-right">
          <file-upload
            ref="upload2"
            post-action="/post.method"
            put-action="/put.method"
            input-id="file2"
            :directory="infile.inputDirMode"
            :multiple="true"
            @input-file="inputFile">
            <img class="img-prop" src="./../../assets/upload.png" height="40">
            <div class="div-prop">{{this.infile.filenameTwo|formatName}}</div>
          </file-upload> 
      </el-col>
    </el-row>
      <div class="el-form-item_custom">
        <el-button type="primary" @click="onSubmit">Compare</el-button>
        <el-button type="infor" @click="onTypeChange">{{this.infile.outputType}}</el-button>
        <el-button type="infor" @click="onModeChange">{{this.infile.inputMode}}</el-button>
      </div>
    </el-form>
    <div class="free-prop"/>
    <div v-html="prettyHtml"></div>
  </div>
</template>

<script>

import { Diff2Html } from 'diff2html'

export default {
  data() {
    return {
      infile: {
        filenameOne: 'Select folder one',
        filenameTwo: 'Select folder two',
        outputFormat: 'side-by-side',
        outputType: 'Unify',
        inputDirMode: true,
        inputMode: 'Folder',
        diffList: []
      }
    }
  },
  methods: {
    onSubmit() {
      var compareXMLFile = function(xml1, xml2, fileName) {
        var convert = require('xml-js')

        var xmldom = require('xmldom')
        var documentc = (new xmldom.DOMParser()).parseFromString(xml1)
        var documentTwo = (new xmldom.DOMParser()).parseFromString(xml2)
        var c14n = require('xml-c14n')()
        var diff = require('diff')
        var canonicaliser = c14n.createCanonicaliser('http://www.w3.org/2001/10/xml-exc-c14n#WithComments')
        canonicaliser.canonicalise(documentc, function(err1, res1) {
          if (err1) {
            return console.warn(err1.stack)
          }
          canonicaliser.canonicalise(documentTwo, function(err2, res2) {
            if (err2) {
              return console.warn(err2.stack)
            }
            var options = { compact: false, ignoreComment: true, spaces: 4 }
            var result4 = convert.xml2js(res1, { object: false, ignoreComment: true, compact: false, spaces: 4, sanitize: true })
            var result4Two = convert.xml2js(res2, { object: false, ignoreComment: true, compact: false, spaces: 4, sanitize: true })

            var sorted = this.sortJsonRecord(result4)
            var sortedTwo = this.sortJsonRecord(result4Two)
            var result = convert.js2xml(sorted, options)
            var resultTwo = convert.js2xml(sortedTwo, options)
            this.infile.text1 = result
            this.infile.text2 = resultTwo
            var changes = diff.createPatch(fileName, result, resultTwo)
            if (changes.split('\n').length > 5) {
              this.infile.diffList.push({ fileName: fileName, changes: changes })
            }
          }.bind(this))
        }.bind(this))
      }.bind(this)
      var path = require('path')
      function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function(name) {
          var filePath = path.join(currentDirPath, name)
          var stat = fs.statSync(filePath)
          if (stat.isFile()) {
            callback(filePath, stat)
          } else if (stat.isDirectory()) {
            walkSync(filePath, callback)
          }
        })
      }
      var compareProFile = function(contentPro1, contentPro2, fileName) {
        const { parse } = require('dot-properties')
        var linesPro1 = parse(contentPro1)
        var linesPro2 = parse(contentPro2)
        var strProList1 = []
        var strProList2 = []
        for (var proItem1 in linesPro1) {
          strProList1.push(proItem1 + ' = ' + linesPro1[proItem1])
        }
        for (var proItem2 in linesPro2) {
          strProList2.push(proItem2 + ' = ' + linesPro2[proItem2])
        }
        strProList1.sort()
        strProList2.sort()
        var proStr1 = ''
        var proStr2 = ''
        for (var proIteml1 in strProList1) {
          proStr1 += strProList1[proIteml1] + '\n'
        }
        for (var proIteml2 in strProList2) {
          proStr2 += strProList2[proIteml2] + '\n'
        }
        return diff.createPatch(fileName, proStr1, proStr2)
      }
      var compareJsonFile = function(contentJson1, contentJson2, fileName) {
        const json = require('json-keys-sort')
        var sortedJson1 = JSON.stringify(json.sort(JSON.parse(contentJson1), true), null, 4)
        var sortedJson2 = JSON.stringify(json.sort(JSON.parse(contentJson2), true), null, 4)
        return diff.createPatch(fileName, sortedJson1, sortedJson2)
      }

      this.infile.diffList = []
      var fs = require('fs')
      var diff = require('diff')
      if (this.infile.inputMode === 'Folder') {
        if (!(fs.existsSync(this.infile.filenameOne) && fs.existsSync(this.infile.filenameTwo))) {
          console.warn('no file exist')
          return
        }
        var fileListXMLOne = []
        var fileListProOne = []
        var fileListJsnOne = []
        var fileListOthOne = []
        walkSync(this.infile.filenameOne, function(filePath, stat) {
          if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'xml') {
            fileListXMLOne.push(filePath.substr(this.infile.filenameOne.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'properties') {
            fileListProOne.push(filePath.substr(this.infile.filenameOne.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'json') {
            fileListJsnOne.push(filePath.substr(this.infile.filenameOne.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() !== 'ds_store') {
            fileListOthOne.push(filePath.substr(this.infile.filenameOne.length))
          }
        }.bind(this))
        var fileListXMLTwo = []
        var fileListProTwo = []
        var fileListJsnTwo = []
        var fileListOthTwo = []
        walkSync(this.infile.filenameTwo, function(filePath, stat) {
          if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'xml') {
            fileListXMLTwo.push(filePath.substr(this.infile.filenameTwo.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'properties') {
            fileListProTwo.push(filePath.substr(this.infile.filenameTwo.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() === 'json') {
            fileListJsnTwo.push(filePath.substr(this.infile.filenameTwo.length))
          } else if (filePath.substr(filePath.lastIndexOf('.') + 1).toLowerCase() !== 'ds_store') {
            fileListOthTwo.push(filePath.substr(this.infile.filenameTwo.length))
          }
        }.bind(this))
        var aXML = new Set(fileListXMLOne)
        var bXML = new Set(fileListXMLTwo)
        var unionXMLFile = new Set([...aXML, ...bXML])
        var unionXMLFileList = Array.from(unionXMLFile)
        var plainCompare = false
        for (var fileItem in unionXMLFileList) {
          var content1 = ''
          var content2 = ''
          plainCompare = false
          if (fileListXMLOne.indexOf(unionXMLFileList[fileItem]) > -1) {
            content1 = fs.readFileSync(this.infile.filenameOne + unionXMLFileList[fileItem], 'utf8')
          } else {
            plainCompare = true
          }
          if (fileListXMLTwo.indexOf(unionXMLFileList[fileItem]) > -1) {
            content2 = fs.readFileSync(this.infile.filenameTwo + unionXMLFileList[fileItem], 'utf8')
          } else {
            plainCompare = true
          }
          if (plainCompare) {
            var changesXMLPlain = diff.createPatch(unionXMLFileList[fileItem], content1, content2)
            if (changesXMLPlain.split('\n').length > 5) {
              this.infile.diffList.push({ fileName: unionXMLFileList[fileItem], changes: changesXMLPlain })
            }
          } else {
            compareXMLFile(content1, content2, unionXMLFileList[fileItem])
          }
        }
        var aPro = new Set(fileListProOne)
        var bPro = new Set(fileListProTwo)
        var unionProFile = new Set([...aPro, ...bPro])
        var unionProFileList = Array.from(unionProFile)
        for (var fileItemPro in unionProFileList) {
          var contentPro1 = ''
          var contentPro2 = ''
          if (fileListProOne.indexOf(unionProFileList[fileItemPro]) > -1) {
            contentPro1 = fs.readFileSync(this.infile.filenameOne + unionProFileList[fileItemPro], 'utf8')
          }
          if (fileListProTwo.indexOf(unionProFileList[fileItemPro]) > -1) {
            contentPro2 = fs.readFileSync(this.infile.filenameTwo + unionProFileList[fileItemPro], 'utf8')
          }
          var changesPro = compareProFile(contentPro1, contentPro2, unionProFileList[fileItemPro])
          if (changesPro.split('\n').length > 5) {
            this.infile.diffList.push({ fileName: unionProFileList[fileItemPro], changes: changesPro })
          }
        }
        var aJson = new Set(fileListJsnOne)
        var bJson = new Set(fileListJsnTwo)
        var unionJson = new Set([...aJson, ...bJson])
        var unionJsonFileList = Array.from(unionJson)
        for (var jsonFileItem in unionJsonFileList) {
          var jsonContent1 = ''
          var jsonContent2 = ''
          plainCompare = false
          if (fileListJsnOne.indexOf(unionJsonFileList[jsonFileItem]) > -1) {
            jsonContent1 = fs.readFileSync(this.infile.filenameOne + unionJsonFileList[jsonFileItem], 'utf8')
          } else {
            plainCompare = true
          }
          if (fileListJsnTwo.indexOf(unionJsonFileList[jsonFileItem]) > -1) {
            jsonContent2 = fs.readFileSync(this.infile.filenameTwo + unionJsonFileList[jsonFileItem], 'utf8')
          } else {
            plainCompare = true
          }
          if (plainCompare) {
            var changesJsonPlain = diff.createPatch(unionJsonFileList[jsonFileItem], jsonContent1, jsonContent2)
            if (changesJsonPlain.split('\n').length > 5) {
              this.infile.diffList.push({ fileName: unionJsonFileList[jsonFileItem], changes: changesJsonPlain })
            }
          } else {
            var changeJson = compareJsonFile(jsonContent1, jsonContent2, unionJsonFileList[jsonFileItem])
            if (changeJson.split('\n').length > 5) {
              this.infile.diffList.push({ fileName: unionJsonFileList[jsonFileItem], changes: changeJson })
            }
          }
        }
        var aOth = new Set(fileListOthOne)
        var bOth = new Set(fileListOthTwo)
        var unionOthFile = new Set([...aOth, ...bOth])
        var unionOthFileList = Array.from(unionOthFile)
        for (var othFileItem in unionOthFileList) {
          var othContent1 = ''
          var othContent2 = ''
          if (fileListOthOne.indexOf(unionOthFileList[othFileItem]) > -1) {
            othContent1 = fs.readFileSync(this.infile.filenameOne + unionOthFileList[othFileItem], 'utf8')
          }
          if (fileListOthTwo.indexOf(unionOthFileList[othFileItem]) > -1) {
            othContent2 = fs.readFileSync(this.infile.filenameTwo + unionOthFileList[othFileItem], 'utf8')
          }
          var changesOth = diff.createPatch(unionOthFileList[othFileItem], othContent1, othContent2)
          if (changesOth.split('\n').length > 5) {
            this.infile.diffList.push({ fileName: unionOthFileList[othFileItem], changes: changesOth })
          }
        }
      } else {
        if (!(fs.existsSync(this.infile.filenameOne) && fs.existsSync(this.infile.filenameTwo))) {
          console.warn('no file exist')
          return
        }
        var fileOneExt = this.infile.filenameOne.substr(this.infile.filenameOne.lastIndexOf('.') + 1)
        var fileTwoExt = this.infile.filenameTwo.substr(this.infile.filenameTwo.lastIndexOf('.') + 1)
        console.log('file', fileOneExt, fileTwoExt)
        content1 = fs.readFileSync(this.infile.filenameOne, 'utf8')
        content2 = fs.readFileSync(this.infile.filenameTwo, 'utf8')
        if (fileOneExt.toLowerCase() === 'xml' && fileTwoExt.toLowerCase() === 'xml') {
          compareXMLFile(content1, content2, this.infile.filenameOne)
        } else if (fileOneExt.toLowerCase() === 'properties' && fileTwoExt.toLowerCase() === 'properties') {
          var changesProFile = compareProFile(content1, content2, this.infile.filenameOne)
          if (changesProFile.split('\n').length > 5) {
            this.infile.diffList.push(changesProFile)
          }
        } else if (fileOneExt.toLowerCase() === 'json' && fileTwoExt.toLowerCase() === 'json') {
          var changesJsonFile = compareJsonFile(content1, content2, this.infile.filenameOne)
          if (changesJsonFile.split('\n').length > 5) {
            this.infile.diffList.push(changesJsonFile)
          }
        } else {
          var changesOthFile = diff.createPatch(this.infile.filenameOne, content1, content2)
          if (changesOthFile.split('\n').length > 5) {
            this.infile.diffList.push(changesOthFile)
          }
        }
      }
      this.$message('Done!')
    },
    inputFile: function(newFile, oldFile) {
      if (typeof this.$refs.upload1.files[0] !== 'undefined') {
        this.infile.filenameOne = this.$refs.upload1.files[this.$refs.upload1.files.length - 1].file.path
      }
      if (typeof this.$refs.upload2.files[0] !== 'undefined') {
        this.infile.filenameTwo = this.$refs.upload2.files[this.$refs.upload2.files.length - 1].file.path
      }
    },
    compareIntegerList(a, b) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      if (typeof a.attributes !== 'undefined' && typeof b.attributes !== 'undefined') {
        for (var attItem in a.attributes) {
          if (typeof b.attributes[attItem] !== 'undefined') {
            if (a.attributes[attItem] < b.attributes[attItem]) {
              return -1
            }
            if (a.attributes[attItem] > b.attributes[attItem]) {
              return 1
            }
          }
        }
      }
      return 0
    },
    sortDiffFile(a, b) {
      if (a.fileName < b.fileName) {
        return -1
      }
      if (a.fileName > b.fileName) {
        return 1
      }
      return 0
    },
    sortJsonRecord(object) {
      var sortedObj = {}
      var keys = Object.keys(object)
      for (var index in keys) {
        var key = keys[index]
        if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
          sortedObj[key] = this.sortJsonRecord(object[key])
        } else if ((object[key] instanceof Array)) {
          object[key].sort(this.compareIntegerList)
          sortedObj[key] = []
          for (var child in object[key]) {
            sortedObj[key].push(this.sortJsonRecord(object[key][child]))
          }
        } else {
          sortedObj[key] = object[key]
        }
      }
      return sortedObj
    },
    onTypeChange() {
      if (this.infile.outputType === 'Unify') {
        this.infile.outputType = 'Split'
        this.infile.outputFormat = 'line-by-line'
      } else {
        this.infile.outputType = 'Unify'
        this.infile.outputFormat = 'side-by-side'
      }
    },
    onModeChange() {
      if (this.infile.inputMode === 'File') {
        this.infile.inputMode = 'Folder'
        this.infile.inputDirMode = true
        this.infile.filenameOne = 'Select folder one'
        this.infile.filenameTwo = 'Select folder two'
      } else {
        this.infile.inputMode = 'File'
        this.infile.inputDirMode = false
        this.infile.filenameOne = 'Select file one'
        this.infile.filenameTwo = 'Select file two'
      }
      this.$refs.upload1.files = []
      this.$refs.upload2.files = []
    }
  },
  computed: {
    prettyHtml: function() {
      var changes = ''
      this.infile.diffList.sort(this.sortDiffFile)
      for (var diffList in this.infile.diffList) {
        changes = changes + this.infile.diffList[diffList].changes
      }
      return Diff2Html.getPrettyHtml(changes, {
        inputFormat: 'diff',
        showFiles: true,
        matching: 'words',
        outputFormat: this.infile.outputFormat
      })
    }
  },
  filters: {
    formatName: function(value) {
      return value
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-form-item{
      margin-bottom: 0px;
}
.el-form-item_custom{
  border-width: 1px;
  border-style: solid;
  border-color: #c0c4cc;
  margin-left: -10px;
  padding: 5px;
}
.el-form-item__content{
  margin-left: 0px;
}
.el-button{
  width: 100px
}
.img-prop{
    padding: 5px 20px;
    border-style: solid;
    border-width: 1px;
    background-color: #ffffff;
    border-color: #cec4c4;
    border-radius: 4px;
    margin: 5px 5px 0px;
}
.div-prop{
    float: right;
    padding-top: 20px;
    padding-left: 10px;
    font-size: small;
}
.span-prop{
    border-style: solid;
    border-width: 1px;
    border-color: #c7c7c7;
    border-radius: 4px;
    margin-left: -10px;
    margin: 1px -8px 2px -10px;
}
.span-right{
  margin-left: 10px;
}
.form-prop{
      position: fixed;
    background-color: #f5f7fa;
    width: 100%;
    top: 0px;
    left: 11px;
}
.free-prop{
  height: 125px;
}
</style>

