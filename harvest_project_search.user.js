// ==UserScript==
// @name           Harvest Project Search
// @version        1.0
// @namespace      harvest_project_search
// @include        https://*.harvestapp.com/*
// ==/UserScript==

var wrapper = function(){

  hps = {

    projSelect: document.getElementById('project_selector'),

    hasSettingsStorage: function(){
    //Abstracted wrapper function for possible future cookie storage..

      // if localStorage is present, use that
      if (('localStorage' in window) && window.localStorage !== null) {
        return 'localStorage'; //return a string of type of storage if multiple types(cookies mayb)
      }
      return false;

    },

    prepareSettingsCache: function(){

      if(hps.hasSettingsStorage()){

        var settings = localStorage.getItem('hpsSettings');
            hps.settings = settings ? JSON.parse(settings) : {};

        return true

      }

      return false;

    },
    setSettingsCache: function(settingsToSet){

      for(var i in settingsToSet){

        if(typeof(settingsToSet[i]) == 'object'){
          hps.settings[i] = Object.extend(hps.settings[i], settingsToSet[i]);
        }

      }

    },
    saveSettings: function(){

      localStorage.setItem('hpsSettings', JSON.stringify(hps.settings));

    },
    init: function(){

      if(hps.projSelect != undefined){

        // Chosenize select
        new Chosen(hps.projSelect);

        // // Add Set default buttons
        // var aDiv = document.createElement('div');
        // $(aDiv).addClassName('hps-btns-wrapper');
        // $(aDiv).update('<a id="set-def-btn" href="#" onclick="hps.setAsDef(\'global\'); return false;" class="btn-submit btn-small">Set as default</a> <div id="scope-selector"><a href="#" onclick="hps.setAsDef(\'project\'); return false;" class="btn-submit btn-small">Project</a><a href="#" onclick="hps.setAsDef(\'global\'); return false;" class="btn-submit btn-small">Global</a></div>');
        // $('add_buttons').appendChild(aDiv);

        // Add CSS
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.appendChild(document.createTextNode('.select_overflow{ overflow:visible !important; } #project_selector_chzn{ margin-bottom:10px; min-width:290px !important; } div.chzn-container ul.chzn-results li{ padding: 4px 7px; } .chzn-results li.group-option{ padding-left: 14px !important; } .chzn-drop { width: 288px !important; } .chzn-search input{ width: 253px !important; } td:first-child .add_day_entry_form{ width:290px; } td.task select{ vertical-align:text-bottom; margin-right:10px !important; } .hps-btns-wrapper{ display:inline-block; float:right; } .hps-btns-wrapper .btn-submit{ margin-right:0; } .hps-btns-wrapper #scope-selector{ display:none; }'));
        document.getElementsByTagName("head")[0].appendChild(styleElement);

        if(hps.hasSettingsStorage()){

          // Add event listener to changes in selects
          $$('#project_tasks_selector_cont select.tasks_select').each(function (el) {
            Event.observe(el, 'change', hps.projTaskSelectChange);
          });

          if(hps.prepareSettingsCache()){

            Event.observe(window, "beforeunload", hps.saveSettings);

          };

        }

      }

    },
    setAsDef: function(scope){
      var activeProjId = hps.projSelect.value,
          activeTaskSelect = $('project' + activeProjId + '_task_selector');

      return false;
    },
    projTaskSelectChange: function(e){
      var activeProjId = hps.projSelect.value,
          activeTaskSelect = $('project' + activeProjId + '_task_selector'),
          activeTaskId = activeTaskSelect.value,
          settings = { defaults: {} };

      settings.defaults[activeProjId] = activeTaskId;

      hps.setSettingsCache(settings);

      return false;
    }

  }

  hps.init();

}

setTimeout(function(){

  var script = document.createElement('script');
  script.textContent = '(' + wrapper.toString() + ')();';
  document.body.appendChild(script);

}, 0);