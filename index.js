const {render} = require('tree-from-paths');

chrome.runtime.onMessage.addListener(({action}, sender, sendRes)=>{
  if(action ==='run_main'){
      modalShown()
        .then(addListeners)
        .then(getName)
        .then(getTree)
        .then(createTree)
        .catch(err=>{
          //TODO - Maybe do some clean up here
          console.log(err);
        })
        .then(()=>sendRes({status:'done'}))
  }
  return true
})
//Make a directory tree and inject it into HTML
const createTree = async (paths) => document.querySelector('#hubtree-modal-inner').innerHTML = render( paths, '',(parent, file, explicit) =>  `${file}<br>`);

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

const getTree = async (name) =>{
  const endpoint = `https://api.github.com/repos/${name}/git/trees/master?recursive=1`
  const treeData = await fetch(endpoint).then(res=>{
   if(res.ok) return res.json();
   throw new Error('Problem with request')
  })
  const paths = treeData.tree.map(item=>item.path);
  if(paths.length > 0) return paths;
  throw new Error('No paths');
}

const addListeners = async () =>{
  document.querySelector('#hubtree-modal').addEventListener('click', (e)=>{
    if(e.target === e.currentTarget) modalShown().catch(err=>console.log(err));
  })
}