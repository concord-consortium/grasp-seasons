// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactDOM from 'react-dom';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/seasons.jsx' was resolved to ... Remove this comment to see the full error message
import Seasons from './components/seasons.jsx';
import ScriptingAPI from './scripting-api';
import ParentMessageAPI from './parent-message-api';
import '../css/main.css';

// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
let seasonsComp = ReactDOM.render(<Seasons/>, document.getElementById('app'));
let scriptingAPI = new ScriptingAPI(seasonsComp);
let parentMessageAPI = new ParentMessageAPI(scriptingAPI);
parentMessageAPI.connect();
// @ts-expect-error ts-migrate(2551) FIXME: Property 'script' does not exist on type 'Window &... Remove this comment to see the full error message
window.script = scriptingAPI;
