import fs from 'fs'
import mkdirp from 'mkdirp'

export const exist = file => new Promise((resolve) => {
  fs.access(file, (fs.constants.R_OK | fs.constants.W_OK), err => err ? resolve(false) : resolve(true))
})

export const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, content) => err ? reject(err) : resolve(content))
})

export const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve())
})

export const makeDir = name => new Promise((resolve, reject) => {
  mkdirp(name, err => err ? reject(err) : resolve())
})

export const mv = (from, to) => new Promise((resolve, reject) => {
  fs.rename(from, to, err => err ? reject(err) : resolve())
})
