import React, {useEffect, useState} from 'react'
import { ArrowDownTrayIcon, Bars3Icon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'


import './App.css'
import Reset from "./Component/Reset";
import config from "../../config";

// import ace from "ace-builds";

function App() {
  // Setting
  // =======
  const settingTempBlank = {
    setting: {
      dropbox_convert: true,
      gdrive_convert: true,
      onedrive_convert: true,
      auto_paste: false
    }
  }

  let [settingTemp, setSettingTemp] = useState(settingTempBlank)  // temporary setting

  useEffect(() => {
    //Runs only on the first render
    chrome.storage.sync.get(['config'], function (result) {
      if (result['config'] != null) {  // config exist in storage
        setSettingTemp(result['config'])

        // configToSettingTemp(result['config'])  // settingTemp = storage
        // config = result['config']  // config = storage
        // console.log("Storage exist")
        // console.log(settingTemp)

      } else {  // config not exist in storage(first time)
        chrome.storage.sync.set({"config": config}, function () {
          console.log("Initialize storage")
        });
        setSettingTemp(config)
      }
    })
  }, []);


  function onChangeSetting(event) {
    setSettingTemp({
      ...settingTemp,
      setting: {
        ...settingTemp.setting,
        [event.target.name]: event.target.value
      }
    });
  }

  function onChangeSettingCheckbox(event) {
    setSettingTemp({
      ...settingTemp,
      setting: {
        ...settingTemp.setting,
        [event.target.name]: event.target.checked
      }
    })
  }

  function saveChange() {
    console.log(settingTemp)
    // settingTempToConfig(config)  // config = settingTemp
    chrome.storage.sync.set({"config": settingTemp}, function () {  // storage = config
      console.log("Change saved")
    });
    displaySaveResult()
  }

  // Other
  // =====
  let [saveResult, setSaveResult] = useState(false)  // true to display save result
  let [resetWarning, setResetWarning] = useState(false)  // true to display reset warning window

  let [extractLinkDisable, setExtractLinkDisable] = useState(false)  // true to disable extract link button

  useEffect(() => {
    if (settingTemp.setting.auto_paste === false) {
      setExtractLinkDisable(true)
    } else {
      setExtractLinkDisable(false)
    }
  }, [settingTemp]);

  function displaySaveResult() {
    setSaveResult(true)
    setTimeout(() => {
      setSaveResult(false)
    }, 3000)
  }

  function closeCurrentTab() {
    chrome.tabs.getCurrent(function (tab) {
      chrome.tabs.remove(tab.id, function () {
      });
    });
  }

  // props send to Reset component
  let resetProp = {
    // resetWarning state
    resetWarning: resetWarning,
    setResetWarning: setResetWarning,
    // settingTemp
    settingTemp: settingTemp,
    setSettingTemp: setSettingTemp
  }

  function onClickReset() {
    setResetWarning(true)
  }

  function openHelpPage() {
    chrome.tabs.create({url: "https://hahahumble.gitbook.io/download-link-generator/"})
  }


  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="md:pt-8 md:pb-10 pt-4 pb-8">
        <div className="2xl:w-1/2 lg:w-2/3 ml-auto mr-auto w-11/12">
          <div className="flex flex-row md:mb-12 mb-8">
            <ArrowDownTrayIcon className="w-10 h-10 fill-gray-700 rounded-full mr-1.5 dark:fill-white mt-0.5"/>
            <p className="text-lg font-bold text-gray-700 font-title mt-[10px] ml-2 dark:text-white">Download Link Generator</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 dark:bg-gray-800">
              <div className="md:grid md:grid-cols-3">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">Share Link</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">Share link settings.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form className="space-y-6">
                    <fieldset>
                      <legend className="text-base font-medium text-gray-900 mt-6 dark:text-white">Dropbox</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <label htmlFor="dropbox_convert" className="font-medium text-gray-700 dark:text-white">
                              Convert Dropbox Share Link
                            </label>
                            <p className="text-gray-500 dark:text-gray-200">Convert Dropbox share link to download link.</p>
                          </div>
                          <div className="h-5 flex items-center">
                            <input
                              id="dropbox_convert"
                              name="dropbox_convert"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              checked={settingTemp.setting.dropbox_convert}
                              onChange={onChangeSettingCheckbox}
                            />
                          </div>
                        </div>
                      </div>
                      <legend className="text-base font-medium text-gray-900 mt-6 dark:text-white">Google Drive</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <label htmlFor="gdrive_convert" className="font-medium text-gray-700 dark:text-gray-200">
                              Convert Google Drive Share Link
                            </label>
                            <p className="text-gray-500 dark:text-gray-200">Convert Google Drive share link to download link.</p>
                          </div>
                          <div className="h-5 flex items-center">
                            <input
                              id="gdrive_convert"
                              name="gdrive_convert"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              checked={settingTemp.setting.gdrive_convert}
                              onChange={onChangeSettingCheckbox}
                            />
                          </div>
                        </div>
                      </div>
                      <legend className="text-base font-medium text-gray-900 mt-6 dark:text-white">OneDrive</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <label htmlFor="onedrive_convert" className="font-medium text-gray-700 dark:text-gray-200">
                              Convert OneDrive Share Link
                            </label>
                            <p className="text-gray-500 dark:text-gray-200">Convert OneDrive share link to download link.</p>
                          </div>
                          <div className="h-5 flex items-center">
                            <input
                              id="onedrive_convert"
                              name="onedrive_convert"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              checked={settingTemp.setting.onedrive_convert}
                              onChange={onChangeSettingCheckbox}
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 dark:bg-gray-800">
              <div className="md:grid md:grid-cols-3">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">Clipboard</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">Clipboard settings.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form className="space-y-6">
                    <fieldset>
                      <legend className="text-base font-medium text-gray-900 mt-6 dark:text-white">Clipboard</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <label htmlFor="auto_paste" className="font-medium text-gray-700 dark:text-white">
                              Paste Clipboard Content
                            </label>
                            <p className="text-gray-500 dark:text-gray-200">Paste clipboard content into input box.</p>
                          </div>
                          <div className="h-5 flex items-center">
                            <input
                              id="auto_paste"
                              name="auto_paste"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              checked={settingTemp.setting.auto_paste}
                              onChange={onChangeSettingCheckbox}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <label htmlFor="extract_link"
                                   className={`font-medium text-gray-700 dark:text-gray-200 ${extractLinkDisable ? 'opacity-50' : ''}`}>
                              Extract Link from Clipboard Content
                            </label>
                            <p className={`text-gray-500 dark:text-gray-200 ${extractLinkDisable ? 'opacity-50' : ''}`}>Extract link from clipboard content(If it doesn't contain any links, nothing will be pasted).</p>
                          </div>
                          <div className="h-5 flex items-center">
                            <input
                              id="extract_link"
                              name="extract_link"
                              type="checkbox"
                              className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${extractLinkDisable ? 'opacity-50' : ''}`}
                              disabled={extractLinkDisable}
                              checked={settingTemp.setting.extract_link}
                              onChange={onChangeSettingCheckbox}
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 dark:bg-gray-800">
              <div className="md:grid md:grid-cols-3">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">About</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">About this extension.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form className="space-y-6">
                    <fieldset>
                      <legend className="text-base font-medium text-gray-900 mt-6 dark:text-white">Help</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm flex flex-row">
                            <label className="font-medium text-gray-700 dark:text-gray-200">
                              Need Help? Go to
                            </label>
                            <div className="flex flex-row ml-1.5 cursor-pointer"
                                 onClick={openHelpPage}>
                              <div className="underline text-blue-900 font-medium dark:text-blue-500">Help Page
                              </div>
                              <div>.</div>
                              {/*<ExternalLinkIcon className="w-4 h-4 fill-blue-900 ml-1.5 mt-0.5 dark:fill-blue-500"/>*/}
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {saveResult ? (<div
                  className=" animate-appear ease-in-out duration-500 text-base mr-5 mt-1.5 font-medium text-gray-700 dark:text-white">Change
                  Saved!</div>)
                : (<></>)}
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-200"
                onClick={closeCurrentTab}
              >
                Cancel
              </button>
              <Reset prop={resetProp}/>
              <button
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                onClick={onClickReset}
              >
                Reset
              </button>
              <button
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={saveChange}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
