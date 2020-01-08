const fs = require("fs")
const config = require("../../config");

const deleteFilesUploaded = (filenames) => {
    return Promise.all(
        filenames.map(filename => new Promise((rs, rj) => {
            fs.unlink(`${config.PATH_ASSETS}/uploads/${filename}`, err => rs());
        }))
    )
}

const deleteOneFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`${config.PATH_ASSETS}/uploads/${filename}`, err => resolve())
    })
}

module.exports = {
    deleteOneFile,
    deleteFilesUploaded
}