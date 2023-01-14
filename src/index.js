import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import '../src/style.css';

/*******************************************
*
* FIREBASE INITIALIZATION
*
********************************************/

const firebaseConfig = {
  apiKey: "AIzaSyDMTzQ-VtEBOZN1Z0Lf8gdQ5p18119znyI",
  authDomain: "hi-finn.firebaseapp.com",
  databaseURL: "https://hi-finn.firebaseio.com",
  projectId: "hi-finn",
  storageBucket: "hi-finn.appspot.com",
  messagingSenderId: "57336111256",
  appId: "1:57336111256:web:8c5427bb7e00b7b17c70ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*******************************************
*
* CONSTANTS
*
********************************************/

const TODAY = Date.now();
const LOADING = 0,
      READY = 1,
      ERROR = 2;
const DOC = document;

/*******************************************
*
* DOM ELEMENT REFERENCES
*
********************************************/

// Left sidebar
let $leftSidebar = document.getElementById('left-sidebar');
let $leftSidebarToggle = document.getElementById('left-sidebar-toggle');
let $leftSidebarOpenIcon = document.getElementById('left-sidebar-open-icon');
let $leftSidebarClosedIcon = document.getElementById('left-sidebar-closed-icon');
let $leftSidebarDivider = document.getElementById('left-sidebar-divider');
let $sidebarFolderList = document.getElementById('sidebar-folder-list');
let $sidebarMenu = document.getElementById('sidebar-menu');

/*******************************************
*
* GLOBAL VARIABLES
*
********************************************/

let folders$ = [];

/*******************************************
*
* STATE MANAGEMENT
*
********************************************/

let state = { };

let setLoading = () => state.view = LOADING;
let setReady = () => state.view = READY;
let setError = () => state.view = ERROR;
let isLoading = () => state.view  === LOADING;
let isReady = () => state.view === READY;
let isError = () => state.view === ERROR;

/*******************************************
*
* EVENT LISTENERS
*
********************************************/

document.addEventListener('DOMContentLoaded', () => {
  
  // Left sidebar
  $leftSidebarToggle.addEventListener('click', () => {
    if ($leftSidebar.classList.contains('is-closed')) {
      $leftSidebar.classList.remove('is-closed');
      $leftSidebarClosedIcon.classList.replace('visible', 'hidden');
      $leftSidebarOpenIcon.classList.replace('hidden', 'visible');
      setTimeout(() => {
        $leftSidebarDivider.classList.replace('hidden', 'visible');
        $sidebarMenu.classList.replace('hidden', 'visible');
      }, 500);
    } else {
      $leftSidebar.classList.add('is-closed');
      $sidebarMenu.classList.replace('visible', 'hidden');
      $leftSidebarDivider.classList.replace('visible', 'hidden');
      $leftSidebarClosedIcon.classList.replace('hidden', 'visible');
      $leftSidebarOpenIcon.classList.replace('visible', 'hidden');
    }
  });
});

/*******************************************
*
* DATA MANAGEMENT
*
********************************************/

const folderCollection = getDocs(collection(db, 'folders'))
  .then((folders) => {
    folders.forEach((folder) => {
      let $folder = createFolderListItem(folder);
      $folder.className = 'is-closed';
      $folder.classList.add('folder-expand-panel');
      $sidebarFolderList.appendChild($folder);
      console.log(folder.data());
      if (folder.data().projects) {
        createProjectList(folder.id)
          .then((el) => {
            $folder.appendChild(el);

            $folder.addEventListener('click', () => {
              if ($folder.classList.contains('is-closed')) {
                $folder.classList.remove('is-closed');
                el.classList.replace('closed', 'open');
              } else {
                $folder.classList.add('is-closed');
                el.classList.replace('open', 'closed');
              }
            });
          });
      }
    });
  });

let createFolderListItem = folder => {
  let $el = document.createElement('li');

  $el.innerHTML = `
    <a>${folder.data().name}</a>
  `;

  return $el;
}

let createProjectList = async (folderId) => {
  let $div = document.createElement('div');
  $div.className = 'project-list closed';
  $div.classList.add('menu');

  let $ul = document.createElement('ul');
  $ul.className = 'menu-list';
  $ul.innerHTML = `
    <p class="menu-label">Projects</p>
  `;
  const q = query(collection(db, 'projects'), where('folder', '==', folderId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((project) => {
    let $el = document.createElement('li');

    $el.innerHTML = `
      <a>${project.data().name}</a>
    `;
    $ul.appendChild($el);
  });

  $div.appendChild($ul);

  return $div;
}
