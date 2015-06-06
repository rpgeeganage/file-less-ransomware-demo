# This is only for Educational purpose.
## ```The purpose of the particular development is to demonstrate on my review paper about file-less malware approach using JavaScript.```
###3rd party libraries used.
1. RSA encryption library
2. Base 64 encoding library
3. Command line execution mechanism of the Poweliks.

## This uses RSA 1024 bit public key to encryption.
### This is a POC for a file-less malware approach with JavaScript.
#### This a Ransom ware.
#####This ransome ware will encrypt the first 23400 characters in PDF, TXT, DOC, DOCX, XLS inside the Document folder.
    eg: C:\Users\Victim\Documents\
    
Registry entry creation

>```Encryption Module``` => ```HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\e```

>```FileReader Module``` => ```HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\f```

>```Decoder Module``` => ```HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\d```

>```Public Key``` => ```HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\pk```

>```Triggering point``` => ```HKCU\Software\Microsoft\Windows\CurrentVersion\Run\fileLessRw```

#####Encryption nd File Reader module is stored in Base 64 Encoded format.

### Exection module

1. Commands in the triggering point entry will read the decoder module and execute it.
2. Decoder reads the File Reader module and decode it then executes it.
3. File reader module will read encryption module and execute against all the files statisfy the selection criteria.
4. Encrption module reads Public key and use its for encryption. 
5. Encrytion module adds a header to each file to identify any file which already encrypted to avoid encrytion again.

# ```PAYLOAD.JS``` contains all the code. Other than that, there are no any files involved or created by the malware.
