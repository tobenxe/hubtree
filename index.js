const {render} = require('tree-from-paths');
const { parse } = require( 'node-html-parser');

chrome.runtime.onMessage.addListener(({action}, sender, sendRes)=>{
  if(action ==='run_main'){
      modalShown()
        .then(getName)
        .then(goToFindFile)
        .then(goToPathEndpoint)
        .then(createTree)
        .catch(err=>{
          //TODO - Maybe do some clean up here
          console.log(err);
        })
  }
})
//Make a directory tree and inject it into HTML
const createTree = async (paths) => {
  document.querySelector('#hubtree-modal-inner').innerHTML = render(
          paths,
          '',
          (parent, file, explicit) => {
            // return `<a class='link' href='${parent}${file}'>${parent}${file}</a><br>`
            return `${parent}${file}<br>`
          }
        )
}

//Add modal to webpage
const addModal = async () =>{
  const modalDiv = document.createElement('div');
  modalDiv.id = 'hubtree-modal';
  modalDiv.classList.add('hubtree-modal');
  const modalInnerHtml = `<div id="hubtree-modal-inner" class="hubtree-modal-inner"> </div>`
  modalDiv.innerHTML = modalInnerHtml;
  document.body.appendChild(modalDiv);
}
//Check if modal is shown
const modalShown = async () =>{
  const modal = document.querySelector('#hubtree-modal');
  //If shown remove modal, if not shown create
     if (modal) {
         modal.parentNode.removeChild(modal)
         throw new Error('Closed Modal');
     }
     await addModal()
     return true
}
//Get the name of the repository
const getName = async () => {
  const name = document.querySelector('meta[property="og:title"]').content;
  console.log(name)
  //TODO - There is probably a better way to validate being in a repository
  if(name && name.includes('/')) return name;
  throw new Error('Name does not exist')
}
//Go to find file to get the path for the tree-list endpoint
const goToFindFile = async (name) =>{
  const findFileUrl = `https://github.com/${name}/find/master`;
  const htmlStr = await fetch(findFileUrl).then(res=>res.text());
  const root = parse(htmlStr);
  const path = root.querySelector('fuzzy-list').getAttribute('data-url');
  return path
}
//Make a request to the endpoint that gives us all files strings in an array.
const goToPathEndpoint = async (endpoint) =>{
  const getPathsUrl = `https://github.com${endpoint}`;
  const paths = (await fetch(getPathsUrl).then(res=>res.json())).paths;
  if(paths) return paths;
  throw new Error('No paths');
}