const {render} = require('tree-from-paths')
const container = document.querySelector('#container');

//Make a directory tree and inject it into HTML
const createTree = async (paths) => {
  container.innerHTML = render(
          paths,
          '',
          (parent, file, explicit) => {
            // return `<a class='link' href='${parent}${file}'>${parent}${file}</a><br>`
            return `${parent}${file}<br>`
          }
        )
}

const getName = async () => {
  const name = document.querySelector('meta[property="og:title"]').content;
  if(name) return name;
  throw new Error('Name does not exist')
}

const goToFindFile = async (name) =>{

}

const goToPathEndpoint = async (endpoint) =>{

}

//Function calls
getName()
  .then(goToFindFile)
  .then(goToPathEndpoint)
  .then(createTree)
  .catch(err=>{
    console.log(err);
    container.innerHTML = 'Oops :/'
  })