import {Render} from './Renderer.js'
const mainContainer = document.getElementById('container');
const renderHTML = async () => {
    mainContainer.innerHTML = await Render();
}
renderHTML()
