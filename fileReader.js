var fileExtList = ['txt','doc', 'docx', 'pdf', 'xls', 'xlsx', 'xlsm']
var fso = new ActiveXObject("Scripting.FileSystemObject");

function getFiles(folderPath) {
	var folder = fso.GetFolder(folderPath);
	var files = folder.files;
	if(files.count > 0) {
  	var fileList = new Enumerator(folder.files);
  	for (; !fileList.atEnd(); fileList.moveNext()) {
			try {
				
			} catch(err) {}
		}
	}
}

function getFolders(path) {
	var folder = fso.GetFolder(path);
	var subFolders = folder.SubFolders;
	if(subFolders.count > 0) {
		var folderList = new Enumerator(subFolders);
		for (; !folderList.atEnd(); folderList.moveNext()) {
			try {
				getFolders(folderList.item());
			} catch(err) {}
		}
	}
	getFiles(path);
}

function getDocumentFolder() {
	var wsh = new ActiveXObject("WScript.Shell");
	var path = wsh.RegRead("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\\Personal");
	getFolders(path);
}

getDocumentFolder();