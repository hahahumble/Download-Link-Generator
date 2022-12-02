// Dropbox
function checkDropboxLink(share_link) {
  return share_link.includes('?dl=0') && share_link.includes('dropbox.com');
}

function convertDropboxLink(enable, share_link) {
  // Ori: https://www.dropbox.com/s/vaeqkwai9p6aorc/Python%20and%20R.jpeg?dl=0
  // Gen: https://www.dropbox.com/s/vaeqkwai9p6aorc/Python%20and%20R.jpeg?raw=1
  if (enable && checkDropboxLink(share_link)) {
    return share_link.replace('?dl=0', '?raw=1');
  }
  return share_link;
}

// Google Drive
function checkGDriveLink(share_link) {
  // Valid
  // Ori: https://drive.google.com/file/d/1a66ElBq_kLZXKTLUzXhceuZ8SbE4ewbt/view?usp=sharing
  // Gen: https://drive.google.com/uc?export=download&id=1a66ElBq_kLZXKTLUzXhceuZ8SbE4ewbt

  // Invalid
  // https://drive.google.com/drive/folders/1-joN8BEV36j8rB4xvzqlhnol617GUNLf?usp=sharing
  return share_link.includes('file') && share_link.includes('drive.google.com');
}

function convertGDriveLink(enable, share_link) {
  if (enable && checkGDriveLink(share_link)) {
    let match = share_link.match(/(\w+)(?=\/view)/g)
    let id = match[0]
    return `https://drive.google.com/uc?export=download&id=${id}`
  }
  return share_link
}

// OneDrive
function checkOneDriveLink(share_link) {
  // Ori: https://1drv.ms/b/s!AtfmzsfO1ntDiH5CiES7tQSzVcUy?e=N0A8MG
  // Gen: https://api.onedrive.com/v1.0/shares/s!AtfmzsfO1ntDiH5CiES7tQSzVcUy/root/content
  return share_link.includes('1drv.ms');
}

function convertOneDriveLink(enable, share_link) {
  if (enable && checkOneDriveLink(share_link)) {
    let match = share_link.match(/(?<=s!)\w*/g)
    let id = match[0]
    return `https://api.onedrive.com/v1.0/shares/s!${id}/root/content`
  }
  return share_link
}

// Extract Link from Clipboard
export function extractLink(enable, share_link) {
  if (enable) {
    let link = share_link
    try {
      link = share_link.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig)[0]
    } catch (e) {
    }
    return link
  }
  return share_link;
}

export function shareToDownloadLink(config, share_link) {
  let link = ""
  if (checkDropboxLink(share_link)) {
    link = convertDropboxLink(config.setting.dropbox_convert, share_link)
    return [link, "dropbox"]
  } else if (checkGDriveLink(share_link)) {
    link = convertGDriveLink(config.setting.gdrive_convert, share_link)
    return [link, "gdrive"]
  } else if (checkOneDriveLink(share_link)) {
    link = convertOneDriveLink(config.setting.onedrive_convert, share_link)
    return [link, "onedrive"]
  }
  return false
}
