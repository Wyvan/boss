'use strict';
var url = 'http://bugzilla.darkcreations.org/jsonrpc.cgi';
function getBugId(plugin, desc, xhr) {
	var request = {
		"method":"Bug.search",
		"params":[{
			"Bugzilla_login":"bossguest@darkcreations.org",
			"Bugzilla_password":"bosspassword",
			"product":"BOSS",
			"component":gameName,
			"summary":plugin
		}],
		"id":1
	};
	outputPluginSubmitText(txt1, 0);
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onerror = pluginSubmitError;
	xhr.onload = function() {
		if (xhr.status == 200 && isResponseOK(xhr.responseText)) {
			var response = JSON.parse(xhr.responseText);
			if (response.result.bugs.length > 0) {
				for (var i = 0; i < response.result.bugs.length; i++) {
				    if (response.result.bugs[i].summary.toLowerCase() == plugin.toLowerCase()) {
	        	        addBugComment(response.result.bugs[i].id, desc, xhr);
				    }
			    }
			} else {
				addBug(plugin, desc, xhr);
			}
		} else {
			outputPluginSubmitText(txt2, -1);
		}
	};
	xhr.send(JSON.stringify(request));
}
function addBugComment(id, comment, xhr) {
	var request = {
		"method":"Bug.add_comment",
		"params":[{
			"Bugzilla_login":"bossguest@darkcreations.org",
			"Bugzilla_password":"bosspassword",
			"id":id,
			"comment":comment
		}],
		"id":2
	};
	outputPluginSubmitText(txt3, 0);
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onerror = pluginSubmitError;
	xhr.onload = function() {
		if (xhr.status == 200 && isResponseOK(xhr.responseText)) {
			outputPluginSubmitText(txt4, 1);
		} else {
			outputPluginSubmitText(txt5, -1);
		}
	};
	xhr.send(JSON.stringify(request));
}
function addBug(summary, description, xhr) {
	var request = {
		"method":"Bug.create",
		"params":[{
			"Bugzilla_login":"bossguest@darkcreations.org",
			"Bugzilla_password":"bosspassword",
			"product":"BOSS",
			"component":gameName,
			"summary":summary,
			"version":"2.1",
			"description":description,
			"op_sys":"Windows",
			"platform":"PC",
			"priority":"---",
			"severity":"enhancement"
		}],
		"id":3
	};
	outputPluginSubmitText(txt6, 0);
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onerror = pluginSubmitError;
	xhr.onload = function() {
		if (xhr.status == 200 && isResponseOK(xhr.responseText)) {
			outputPluginSubmitText(txt7, 1);
		} else {
			outputPluginSubmitText(txt8, -1);
		}
	};
	xhr.send(JSON.stringify(request));
}
function pluginSubmitError() {
	outputPluginSubmitText(txt9, -1);
}
function isResponseOK(text) {
	return (JSON.parse(text).error == null);
}
function HTMLToJSON(text) {
	return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');
}
function isStorageSupported(){
	try {
		return ('localStorage' in window && window['localStorage'] !== null && window['localStorage'] !== undefined);
	} catch (e) {
		return false;
	}
}
function isPluginSubmitSupported(){
	return ('withCredentials' in new XMLHttpRequest && typeof(JSON) === 'object' && typeof(JSON.parse) === 'function');
}
function isStyleSupported(propName) {
	return typeof document.body.style[propName] !== 'undefined';
}
function isValidationSupported(){
	return ('checkValidity' in document.createElement('form'));
}
function storeData(key, value){
	try {
		localStorage.setItem(key, value);
	} catch (e) {
		if (e == QUOTA_EXCEEDED_ERR) {
			alert(txt10);
		}
	}
}
function showElement(element){
	if (element != null){
		if (element.className.indexOf('hidden') != -1) {
			element.className = element.className.replace('hidden','');
		} else if (element.className.indexOf('visible') == -1) {
			element.className += ' visible';
		}
	}
}
function hideElement(element){
	if (element != null) {
		if (element.className.indexOf('visible') != -1) {
			element.className = element.className.replace('visible','');
		}else if (element.className.indexOf('hidden') == -1) {
			element.className += ' hidden';
		}
	}
}
function stepUnhideElement(element){
	if (element != null && element.className.indexOf('hidden') != -1){
		element.className = element.className.replace('hidden','');
	}
}
function stepHideElement(element){
	if (element != null) {
		element.className += ' hidden';
	}
}
function saveCheckboxState(evt) {
	if (evt.currentTarget.checked) {
		storeData(evt.currentTarget.id, true);
	} else {
		localStorage.removeItem(evt.currentTarget.id);
	}
}
function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.currentTarget.className = evt.currentTarget.className.replace('dragHover','');
	var files = evt.dataTransfer.files;
	var a = document.getElementById('cssSettings').querySelectorAll('input[type=text]');
	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {
				try {
					var json = JSON.parse(e.target.result).colors;
					for (var key in json) {
						if (json.hasOwnProperty(key) && json[key].length != 0) {
							for (var i=0, z=a.length; i < z; i++) {
								if (a[i].getAttribute('data-selector') == key) {
									a[i].value = json[key].split(':').pop();
								}
							}
						}
					}
				} catch (e) {
					alert(e);
				}
			};
		})(f);
		reader.readAsText(f);
	}
}
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
	if (evt.currentTarget.className.indexOf('dragHover') == -1) {
		evt.currentTarget.className = 'dragHover ' + evt.currentTarget.className;
	}
}
function handleDragLeave(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.currentTarget.className = evt.currentTarget.className.replace('dragHover','');
}
function toggleDisplayCSS(evt){
	var e = document.getElementsByClassName(evt.currentTarget.getAttribute('data-class'));
	if(evt.currentTarget.checked){
		for(var i=0,z=e.length;i<z;i++){
            e[i].className += ' hidden';
		}
	}else{
		for(var i=0,z=e.length;i<z;i++){
			e[i].className = e[i].className.replace(' hidden','');
		}
	}
}
function toggleFilters(evt){
	var filters = document.getElementsByTagName('aside')[0];
	var arrow = document.getElementById('arrow');
	if (arrow.className.indexOf('rotated') == -1) {
		showElement(filters);
		arrow.className += ' rotated';
	} else {
		hideElement(filters);
		arrow.className = arrow.className.replace('rotated','');
	}
}
function showSubmitBox(evt){
	document.getElementById('plugin').textContent=evt.currentTarget.textContent;
	showElement(document.getElementById('overlay'));
}
function hideSubmitBox(evt){
	var output = document.getElementById('output');
	hideElement(document.getElementById('overlay'));
	hideElement(output);
	showElement(document.getElementById('submitBox').getElementsByTagName('form')[0][2]);
	output.innerHTML='';
}
function submitPlugin(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (evt.currentTarget[0].value.length == 0 && evt.currentTarget[1].value.length == 0){
		outputPluginSubmitText(txt11, -2);
		return;
	} else if (isValidationSupported() && !evt.currentTarget.checkValidity()){
		return;
	}
	var desc = evt.currentTarget[0].value;
	if (desc.length != 0) {
		desc += '\n\n';
	}
	desc += evt.currentTarget[1].value;
	try {
		var xhr = new XMLHttpRequest();
		getBugId(HTMLToJSON(document.getElementById('plugin').textContent), HTMLToJSON(desc), xhr);
	} catch(err) {
		outputPluginSubmitText(txt12 + err.message, -1);
	}
}
function showSection(evt){
	hideElement(document.querySelector('section.visible'));
	showElement(document.getElementById(evt.currentTarget.getAttribute('data-section')));
	var elem = document.querySelector('nav div.current');
	if (elem != null){
		elem.className = elem.className.replace('current', '');
	}
	if (evt.currentTarget.className.indexOf('current') == -1) {
		evt.currentTarget.className += ' current';
	}
	/*Also enable/disable filters based on current page.*/
	var elemArr = document.getElementsByTagName('aside')[0].getElementsByTagName('input');
	for (var i=0, z=elemArr.length;i<z;i++){
		if (elemArr[i].id  == 'hideVersionNumbers' && (evt.currentTarget.getAttribute('data-section') == 'sePlugins' || evt.currentTarget.getAttribute('data-section') == 'recPlugins' || evt.currentTarget.getAttribute('data-section') == 'unrecPlugins')){
			elemArr[i].disabled = false;
		} else if (elemArr[i].id  == 'hideActiveLabel' && (evt.currentTarget.getAttribute('data-section') == 'sePlugins' || evt.currentTarget.getAttribute('data-section') == 'recPlugins' || evt.currentTarget.getAttribute('data-section') == 'unrecPlugins')){
			elemArr[i].disabled = false;
		} else if (elemArr[i].id  == 'hideChecksums' && (evt.currentTarget.getAttribute('data-section') == 'sePlugins' || evt.currentTarget.getAttribute('data-section') == 'recPlugins' || evt.currentTarget.getAttribute('data-section') == 'unrecPlugins')){
			elemArr[i].disabled = false;
		} else if (evt.currentTarget.getAttribute('data-section') == 'recPlugins'){
			elemArr[i].disabled = false;
		} else {
			elemArr[i].disabled = true;
		}
	}
}
function toggleMessages(evt){
	var listItems = document.getElementById('recPlugins').getElementsByTagName('li');
	var i = listItems.length - 1;
	var hiddenNo = parseInt(document.getElementById('hiddenMessageNo').textContent);
	while (i>-1){
		var spans = listItems[i].getElementsByTagName('span');
		if (spans.length == 0 || spans[0].className.indexOf('mod') == -1){
			var filterMatch = false;
			if (evt.currentTarget.id == 'hideAllPluginMessages'){
				filterMatch = true;
			} else if (evt.currentTarget.id == 'hideNotes' && listItems[i].className.indexOf('note') != -1){
				filterMatch = true;
			} else if (evt.currentTarget.id == 'hideBashTags' && listItems[i].className.indexOf('tag') != -1){
				filterMatch = true;
			} else if (evt.currentTarget.id == 'hideRequirements' && listItems[i].className.indexOf('req') != -1){
				filterMatch = true;
			} else if (evt.currentTarget.id == 'hideIncompatibilities' && listItems[i].className.indexOf('inc') != -1){
				filterMatch = true;
			} else if (evt.currentTarget.id == 'hideDoNotCleanMessages' && listItems[i].className.indexOf('dirty') != -1 && (listItems[i].textContent.indexOf('Do not clean.') != -1 || listItems[i].textContent.indexOf(txt13) != -1)){
				filterMatch = true;
			}
			if (filterMatch){
				if (evt.currentTarget.checked){
					if (listItems[i].className.indexOf('hidden') == -1){
						hiddenNo++;
					}
					stepHideElement(listItems[i]);
				} else {
					stepUnhideElement(listItems[i]);
					if (listItems[i].className.indexOf('hidden') == -1){
						hiddenNo--;
					}
				}
			}
		}
		i--;
	}
	document.getElementById('hiddenMessageNo').textContent = hiddenNo;
	var event = document.createEvent('Event');
	event.initEvent('click', true, true);
	document.getElementById('hideMessagelessPlugins').dispatchEvent(event);
}
function togglePlugins(evt){
	var plugins = document.getElementById('recPlugins').getElementsByTagName('ul')[0].childNodes;
	var i = plugins.length - 1;
	var hiddenNo = parseInt(document.getElementById('hiddenPluginNo').textContent);
	while (i>-1){
		if (plugins[i].nodeType == Node.ELEMENT_NODE){
			var isMessageless = true,
			isInactive = true,
			isClean = true;
			var messages = plugins[i].getElementsByTagName('li');
			var j = messages.length - 1;
			while (j > -1){
				if (messages[j].className.indexOf('hidden') == -1){
					isMessageless = false;
					break;
				}
				j--;
			}
			if (plugins[i].getElementsByClassName('active').length != 0){
				isInactive = false;
			}
			if (plugins[i].getElementsByClassName('dirty').length != 0){
				isClean = false;
			}
			if ((document.getElementById('hideMessagelessPlugins').checked && isMessageless)
				|| (document.getElementById('hideInactivePlugins').checked && isInactive)){
				if (plugins[i].className.indexOf('hidden') == -1){
					hiddenNo++;
					hideElement(plugins[i]);
				}
			} else if (plugins[i].className.indexOf('hidden') != -1){
					hiddenNo--;
					showElement(plugins[i]);
			}
		}
		i--;
	}
	document.getElementById('hiddenPluginNo').textContent = hiddenNo;
}
function outputPluginSubmitText(text, flag) {
	var output = document.getElementById('output');
	if (flag != -2)
	hideElement(document.getElementById('submitBox').getElementsByTagName('form')[0][2]);
	showElement(output);
	if (output.innerHTML.length != 0) {
		output.innerHTML += '<br />';
	}
	if (flag < 0) {
		text = "<span style='color:red;'>" + text + "</span>";
	} else if (flag == 1) {
		text = "<span class='success'>" + text + "</span>";
	}
	output.innerHTML += text;
}
function showBrowserBox(){
	if (isPluginSubmitSupported()) {
		document.getElementById('pluginSubmitSupport').className = 't';
	} else {
		document.getElementById('pluginSubmitSupport').className = 'c';
	}
	if (isStorageSupported()) {
		document.getElementById('memorySupport').className = 't';
	} else {
		hideElement(document.getElementById('browserBox').querySelector('label'));
		document.getElementById('memorySupport').className = 'c';
	}
	if (isStyleSupported('opacity')) {
		document.getElementById('opacitySupport').className = 't';
	} else {
		document.getElementById('opacitySupport').className = 'c';
	}
	if (isStyleSupported('boxShadow')) {
		document.getElementById('shadowsSupport').className = 't';
	} else {
		document.getElementById('shadowsSupport').className = 'c';
	}
	if (isStyleSupported('transition') || isStyleSupported('MozTransition') || isStyleSupported('webkitTransition') || isStyleSupported('OTransition') || isStyleSupported('msTransition')) {
		document.getElementById('transitionsSupport').className = 't';
	} else {
		document.getElementById('transitionsSupport').className = 'c';
	}
	if (isStyleSupported('transform') || isStyleSupported('MozTransform') || isStyleSupported('webkitTransform') || isStyleSupported('OTransform') || isStyleSupported('msTransform')) {
		document.getElementById('transformsSupport').className = 't';
	} else {
		document.getElementById('transformsSupport').className = 'c';
	}
	if ('placeholder' in document.createElement('input')) {
		document.getElementById('placeholderSupport').className = 't';
	} else {
		document.getElementById('placeholderSupport').className = 'c';
	}
	if (isValidationSupported()) {
		document.getElementById('validationSupport').className = 't';
	} else {
		document.getElementById('validationSupport').className = 'c';
	}
    var summaryButton = document.getElementsByTagName('nav')[0].getElementsByClassName('button')[0];
    if (summaryButton.className.indexOf('current') == -1){
        summaryButton.className += ' current';
    }
    showElement(document.getElementsByTagName('section')[0]);
}
function loadSettings(){
	var i = localStorage.length - 1;
	while (i > -1) {
		var elem = document.getElementById(localStorage.key(i));
		if (elem != null && 'defaultChecked' in elem) {
			elem.checked = true;
			var event = document.createEvent('Event');
			event.initEvent('click', true, true);
			elem.dispatchEvent(event);
		}
		i--;
	}
}
function setupEventHandlers(){
	var i, elemArr;
	if (isStorageSupported()){  /*Set up filter value and CSS setting storage read/write handlers.*/
		elemArr = document.getElementsByTagName('aside')[0].getElementsByTagName('input');
		i = elemArr.length - 1;
		while(i > -1){
			elemArr[i].addEventListener('click', saveCheckboxState, false);
			i--;
		}
	}
	if (isPluginSubmitSupported() && document.getElementById('unrecPlugins') != null){  /*Set up handlers for plugin submitter.*/
		elemArr = document.getElementById('unrecPlugins').querySelectorAll('span.mod');
		i = elemArr.length - 1;
		while(i > -1){
			elemArr[i].addEventListener('click', showSubmitBox, false);
			i--;
		}
		document.getElementById('submitBox').getElementsByTagName('form')[0].addEventListener('reset', hideSubmitBox, false);
		document.getElementById('submitBox').getElementsByTagName('form')[0].addEventListener('submit', submitPlugin, false);
	}
	document.getElementById('filtersButtonToggle').addEventListener('click', toggleFilters, false);
	/*Set up handlers for section display.*/
	elemArr = document.getElementsByTagName('nav')[0].querySelectorAll('nav > div.button');
	var i = elemArr.length - 1;
	while(i > -1){
		elemArr[i].addEventListener('click', showSection, false);
		i--;
	}
	document.getElementById('supportButtonShow').addEventListener('click', showSection, false);
	/*Set up handlers for filters.*/
	document.getElementById('hideVersionNumbers').addEventListener('click', toggleDisplayCSS, false);
	document.getElementById('hideActiveLabel').addEventListener('click', toggleDisplayCSS, false);
	document.getElementById('hideChecksums').addEventListener('click', toggleDisplayCSS, false);
	document.getElementById('hideNotes').addEventListener('click', toggleMessages, false);
	document.getElementById('hideBashTags').addEventListener('click', toggleMessages, false);
	document.getElementById('hideRequirements').addEventListener('click', toggleMessages, false);
	document.getElementById('hideIncompatibilities').addEventListener('click', toggleMessages, false);
	document.getElementById('hideDoNotCleanMessages').addEventListener('click', toggleMessages, false);
	document.getElementById('hideAllPluginMessages').addEventListener('click', toggleMessages, false);
	document.getElementById('hideInactivePlugins').addEventListener('click', togglePlugins, false);
	document.getElementById('hideMessagelessPlugins').addEventListener('click', togglePlugins, false);
}
function applyFeatureSupportRestrictions(){
	if (!isPluginSubmitSupported() && document.getElementById('unrecPlugins') != null) { /*Disable unrecognised mod underline effect.*/
		var buttons = document.getElementById('unrecPlugins').querySelectorAll('span.mod');
		for (var i=0, len=buttons.length; i < len; i++) {
			buttons[i].className += 'nosubmit';
		}
		hideElement(document.getElementById('unrecPluginsSubmitNote'));
	}
	if (isStorageSupported()) {
		hideElement(document.getElementById('loseSettingsClose'));
	} else {
		hideElement(document.getElementById('loseSettingsCacheClear'));
	}
}
function init(){
	setupEventHandlers();
	if (isStorageSupported()){
		loadSettings();
	}
	applyFeatureSupportRestrictions();
	/*Initially disable all filters.*/
	var elemArr = document.getElementsByTagName('aside')[0].getElementsByTagName('input');
	for (var i=0, z=elemArr.length;i<z;i++){
		elemArr[i].disabled = true;
	}
	showBrowserBox();
}
init();