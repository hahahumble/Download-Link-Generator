import React, {useEffect, useState} from 'react'
import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

import dropbox from '../../assets/dropbox.png'
import gdrive from '../../assets/gdrive.png'
import onedrive from '../../assets/onedrive.png'

import './App.css'
import MenuButton from "./Component/MenuButton";
import {shareToDownloadLink, extractLink} from "../../TextGen"

import config from "../../config";

function App() {
  let showLinkCopyResultDefault = {  // true to show result, false to hide result
    downloadLink: false,
  }

  let [linkCopyResult, setLinkCopyResult] = useState(showLinkCopyResultDefault)
  let [showShareLinkError, setShowShareLinkError] = useState(false)
  let [shareLinkIcon, setShareLinkIcon] = useState("none")

  let [shareLink, setShareLink] = useState('')
  let [downloadLink, setDownloadLink] = useState('')

  function displayMarkdownCopyResult() {
    setLinkCopyResult(previousState => {
      return {...previousState, downloadLink: true}  // show Markdown link copy result
    })

    // Hide copy result after 3 second
    setTimeout(() => {
      setLinkCopyResult(previousState => {
        return {...previousState, downloadLink: false}
      })
    }, 3000);
  }

  // Get content from clipboard
  function getClipboard() {
    let t = document.createElement("input");
    document.body.appendChild(t);
    t.focus();
    document.execCommand("paste");
    let clipboardText = t.value;  // Clipboard data
    document.body.removeChild(t);
    return clipboardText;
  }

  // Set content of clipboard
  function setClipboard(text) {
    let copyFrom = document.createElement("textarea");  // Create a text-box field where we can insert text to
    copyFrom.textContent = text;  // Set the text content to be the text you wished to copy.
    document.body.appendChild(copyFrom);  // Append the text-box field into the body as a child. "execCommand()" only works when there exists selected text, and the text is inside document.body (meaning the text is part of a valid rendered HTML element).
    copyFrom.select();  // Select all the text!
    document.execCommand('copy');  // Execute command
    copyFrom.blur();  // (Optional) De-select the text using blur().
    document.body.removeChild(copyFrom);  // Remove the text-box field from the document.body, so no other JavaScript nor other elements can get access to this.
  }

  function markdownCopyToClipboard() {
    setClipboard(downloadLink)
  }

  function markdownCopyClick() {
    displayMarkdownCopyResult()
    markdownCopyToClipboard()
  }

  // Get share link from clipboard
  useEffect(() => {
    chrome.storage.sync.get(['config'], function (result) {
      if (result['config'] != null) {  // config exist in storage
        let config_temp = result['config']  // set the config value
        let auto_paste = config_temp.setting.auto_paste  // get auto paste setting
        let extract_link = config_temp.setting.extract_link

        if (auto_paste === true) {
          let text = getClipboard()
          // refactor
          if (extract_link === true) {
              text = extractLink(true, text)  // !
          }
          setShareLink(text)
        }
      } else {  // config not exist in storage
        // using default config
        if (config.setting.auto_paste === true) {
          let text = getClipboard()
          if (config.setting.extract_link === true && text != null) {
            text = extractLink(true, text)
          }
          setShareLink(text)
        }
      }
    })
  }, []);

  function shareLinkChange(config, share_link) {
    if (share_link === "") {  // share link is empty
      setShareLinkIcon("none")  // don't show error and icon
      setShowShareLinkError(false)
      setDownloadLink("")
    } else {  // share link is not empty
      if (shareToDownloadLink(config, share_link) !== false) {  // share link valid
        setShowShareLinkError(false)
        let download_link = shareToDownloadLink(config, share_link)[0]
        setDownloadLink(download_link)
        let share_link_icon = shareToDownloadLink(config, share_link)[1]
        setShareLinkIcon(share_link_icon)
      } else {  // share link invalid
        setShareLinkIcon("none")
        setShowShareLinkError(true)
        setDownloadLink("")
      }
    }
  }

  // Change Download link if Share Link changed
  useEffect(() => {
    let config_temp = config
    chrome.storage.sync.get(['config'], function (result) {
      if (result['config'] != null) {  // config exist in storage
        config_temp = result['config']  // set the config value
      }
    })
    shareLinkChange(config_temp, shareLink)
  }, [shareLink]);

  function openAboutPage() {
    chrome.tabs.create({url: "https://hahahumble.gitbook.io/download-link-generator/"})
  }

  function openNewWindow() {
    chrome.windows.create({
      // Just use the full URL if you need to open an external page
      url: chrome.runtime.getURL("popup.html")
    });
  }

  return (
    <div className="w-96 dark:bg-gray-800 popup:w-full">
      {/* Header */}
      <div className="pt-2 pb-2 pl-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-row">
          <ArrowDownTrayIcon className="w-6 h-6 fill-gray-700 rounded-full mr-1.5 dark:fill-white"/>
          <p className="text-sm font-bold text-gray-700 font-title mt-0.5 dark:text-white select-none">Download Link Generator</p>
          {/*<div onClick={openNewWindow}>open</div>*/}
          <div className="ml-auto mr-3 mt-0.5">
            <MenuButton/>
          </div>
        </div>
      </div>
      {/* Share Link */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <div className="w-80 ml-auto mr-auto mt-3 mb-6">
          <div className="flex flex-row">
            <label htmlFor="share-link" className="block text-sm font-medium text-gray-700 dark:text-white select-none">
              Share Link:
            </label>
            { shareLinkIcon === "dropbox" && <img src={dropbox}  alt={"dropbox"} className={"w-[4.5] h-4 ml-2 mt-0.5"}/> }
            { shareLinkIcon === "gdrive" &&  <img src={gdrive}  alt={"gdrive"} className={"w-4 h-4 ml-2 mt-0.5"}/> }
            { shareLinkIcon === "onedrive" &&  <img src={onedrive}  alt={"onedrive"} className={"w-6 h-4 ml-2 mt-0.5"}/> }
          </div>
          <div className="mt-1">
            <input
              type="search"
              name="share-link"
              id="share-link"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Share Link"
              spellCheck="false"
              value={shareLink}
              onChange={(e) => setShareLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center">
            {showShareLinkError ? (<div
              className="absolute text-sm font-medium text-red-500 mt-0.5 dark:text-red-500 select-none">Invalid Share Link!</div>) : (<></>)}
          </div>
        </div>
      </div>
      {/* Download Link */}
      <div className="border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-80 ml-auto mr-auto mt-4 mb-6">
          <label htmlFor="download-link" className="block text-sm font-medium text-gray-700 dark:text-white select-none">
            Download Link:
          </label>
          <div className="mt-1 flex flex-row">
            <input
              type="text"
              name="download-link"
              id="download-link"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500 dark:text-white"
              placeholder="Download Link"
              spellCheck="false"
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
            />
            <button
              className="w-16 ml-2 border border-transparent shadow-sm font-medium rounded-md text-white text-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={markdownCopyClick}
            >
              Copy
            </button>
          </div>
          <div className="flex flex-col items-center">
            {linkCopyResult.downloadLink ? (<div
              className="animate-appear ease-in-out duration-500 absolute text-sm font-medium text-gray-700 mt-0.5 dark:text-white">
              Link has been copied!</div>) : (<></>)}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 h-10 dark:bg-gray-900">
          <div className="flex flex-row justify-end text-sm text-blue-900 underline dark:text-white">
            <div className="flex flex-row mt-2 mr-2 cursor-pointer select-none" onClick={openAboutPage}>
              <p>About</p>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 fill-blue-900 ml-1.5 mt-0.5 dark:fill-white"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
