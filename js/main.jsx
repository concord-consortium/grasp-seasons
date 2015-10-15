import React from 'react';
import Seasons from './components/seasons.jsx';
import ScriptingAPI from './scripting-api.js';
import ParentMessageAPI from './parent-message-api.js';
import '../css/main.css';

let seasonsComp = React.render(<Seasons/>, document.getElementById('app'));
let scriptingAPI = new ScriptingAPI(seasonsComp);
let parentMessageAPI = new ParentMessageAPI(scriptingAPI);
parentMessageAPI.connect();
window.script = scriptingAPI;
