"use strict";
import * as vscode from "vscode";
import { EncryptDecrypt } from "./EncryptDecrypt"

export function activate(context: vscode.ExtensionContext) {
  console.log("Encrypt Decrypt Extension launched.");

  let encryptDecrypt = new EncryptDecrypt(context);
  return encryptDecrypt.register();
}


export function deactivate() {}
