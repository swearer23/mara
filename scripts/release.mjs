import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json'))

inquirer.prompt([
  {
    type: 'input',
    name: 'newerVersion',
    message: `input newer version (current: ${version}):`
  },
  {
    type: 'input',
    name: 'description',
    message: `input release note:`
  }
]).then(answers => {
  const { newerVersion, description } = answers
  const packageInfo = JSON.parse(readFileSync('./package.json'))
  packageInfo.version = newerVersion
  writeFileSync('./package.json', JSON.stringify(packageInfo, null, 2))
  execSync(`git add .`)
  execSync(`npm run build`)
  execSync(`git commit -a -m 'release ${newerVersion}: ${description}'`)
  execSync(`git tag ${newerVersion} && git push origin master`)
  console.log('release success!')
}).catch(err => {
  console.log(err)
})