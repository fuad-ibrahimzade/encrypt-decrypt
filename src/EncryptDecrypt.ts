import { ExtensionContext } from "vscode";
import * as interfaces from "./interfaces";
import * as vscode from "vscode";
let cryptoJs = require('crypto-js');

export class EncryptDecrypt implements interfaces.IEncryptDecrypt, vscode.Disposable {

    private context: ExtensionContext;
    private key: any;
    private iv: any;
    private disposables: vscode.Disposable[] = [];



    constructor(context: ExtensionContext) {
        this.context = context

        this.key = cryptoJs.enc.Utf8.parse('7061737323313233');
        this.iv = cryptoJs.enc.Utf8.parse('7061737323313233');
    }

    public dispose() {
        if (this.disposables) {
            this.disposables.forEach(item => item.dispose());
            this.disposables = null;
        }
    }


    public register(): Promise<boolean> {
        try {

            this.disposables.push(vscode.commands.registerCommand('encryptDecrypt.AESEncrypt', this.AESEncrypt, this));
            this.disposables.push(vscode.commands.registerCommand('encryptDecrypt.AESDecrypt', this.AESDecrypt, this));
            this.disposables.push(vscode.commands.registerCommand('encryptDecrypt.ForgetPassword', this.forgetPassword, this));
            this.disposables.push(vscode.commands.registerCommand('encryptDecrypt.SetPassword', this.askPasswordThenSet, this));

            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(false);
        }
    }

    changeText(f: (txt: string) => string): void {
        if (!vscode.window.activeTextEditor) {
            return;
        }

        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for (var x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                try {
                    edit.replace(sel[x], f(txt));
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }

    initedPassword(): boolean {
        if (!this.context.globalState.get('ed.password')) {
            this.key = cryptoJs.enc.Utf8.parse('7061737323313233');
            this.iv = cryptoJs.enc.Utf8.parse('7061737323313233');
        }

        return !!this.context.globalState.get('ed.password')
    }

    setPassword(password: string): void {
        this.context.globalState.update('ed.password', password)
        this.key = cryptoJs.enc.Utf8.parse(this.context.globalState.get('ed.password'));
        this.iv = cryptoJs.enc.Utf8.parse(this.context.globalState.get('ed.password'));
    }

    forgetPassword(): void {
        this.context.globalState.update('ed.password', undefined)
        this.key = cryptoJs.enc.Utf8.parse('7061737323313233');
        this.iv = cryptoJs.enc.Utf8.parse('7061737323313233');
    }

    askPasswordThenSet(): void {
        this.forgetPassword()
        this.askPassword().then(undefined, err => console.log('askPasswordThenSet error', err))
    }

    askPassword(): Thenable<void> {
        if (this.initedPassword()) return Promise.resolve(this.context.globalState.get('ed.password'));
        var self = this;
        return vscode.window.showInputBox({
            password: true, prompt: "What's the password to encrypt/decrypt this message?", placeHolder: "password", ignoreFocusOut: true,
            validateInput: this.validatePassword
        }).then(function (password) {
            if (password) {
                self.setPassword(password)
                // this.context.globalState.update('ed.password', password)
                return Promise.resolve(self.context.globalState.get('ed.password'));
            }
            return Promise.reject();
        });
    }

    private validatePassword(password: string): string {
        if (password === undefined || password === null || password === "") {
            return "You must provide a password";
        }
        if (password.length <= 4) {
            return "The password must have at least 5 characters";
        }
        return undefined;
    }

    AESEncrypt(): void {
        this.askPassword().then((password) => {
            this.changeText(txt => {
                // let encrypted = cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt),this.key,{keySize: 128 / 8,iv: this.iv,mode: cryptoJs.mode.CBC,padding: cryptoJs.pad.Pkcs7,});
                // return encrypted.toString();
                
                const encrypted = cryptoJs.AES.encrypt(txt, this.context.globalState.get('ed.password')).toString();
                return encrypted;
                // return cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt), password).toString();
                // return cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt), this.key, { iv: this.iv }).toString();
                // return cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt), this.key, { 
                //     iv: this.iv, 
                //     padding: cryptoJs.pad.Pkcs7,
                //     mode: cryptoJs.mode.CBC
                    
                // }).toString();
                // var data = cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt), this.key);
                // return data.toString()

            });
        }, err => console.log('AESEncrypt error', err))
    }


    AESDecrypt(): void {
        this.askPassword().then((password) => {
            this.changeText(txt => {
                // let decrypted = cryptoJs.AES.decrypt(txt, this.key, {
                //     keySize: 128 / 8,
                //     iv: this.iv,
                //     mode: cryptoJs.mode.CBC,
                //     padding: cryptoJs.pad.Pkcs7,
                // }).toString(cryptoJs.enc.Utf8);
                // return decrypted

                const decrypted  = cryptoJs.AES.decrypt(txt, this.context.globalState.get('ed.password')).toString(cryptoJs.enc.Utf8);
                return decrypted
                // return cryptoJs.AES.decrypt(txt, password).toString(cryptoJs.enc.Utf8);
                // return cryptoJs.AES.decrypt(txt, this.key, { iv: this.iv }).toString(cryptoJs.enc.Utf8)
                // return cryptoJs.AES.decrypt(txt, this.key, { 
                //     iv: this.iv, 
                //     padding: cryptoJs.pad.Pkcs7,
                //     mode: cryptoJs.mode.CBC
                    
                // }).toString(cryptoJs.enc.Utf8);
                // var decr = cryptoJs.AES.decrypt(txt, this.key).toString(cryptoJs.enc.Utf8);
                // return decr;
            });
        }, err => console.log('AESDecrypt error', err))
    }
}