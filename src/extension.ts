import * as vscode from 'vscode';
import { scan } from './scanner';
import { recordHit } from './reviewPrompt';

let diagnostics: vscode.DiagnosticCollection;

function refresh(context: vscode.ExtensionContext, document: vscode.TextDocument): void {
  if (document.languageId !== 'ruby' && !document.uri.path.endsWith('.rb')) return;

  const hits = scan(document.getText());
  const result = hits.map((hit) => {
    const line = hit.line - 1;
    const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
    const diagnostic = new vscode.Diagnostic(
      range,
      'params.permit! disables Rails strong parameters entirely -- every current and future model attribute becomes mass-assignable, including ones never meant to be settable.',
      vscode.DiagnosticSeverity.Warning,
    );
    diagnostic.source = 'Rails Mass Assignment Companion';
    recordHit(context, `${document.uri.toString()}:${line}`);
    return diagnostic;
  });
  diagnostics.set(document.uri, result);
}

export function activate(context: vscode.ExtensionContext): void {
  diagnostics = vscode.languages.createDiagnosticCollection('railsMassAssignmentCompanion');
  context.subscriptions.push(diagnostics);

  vscode.workspace.textDocuments.forEach((doc) => refresh(context, doc));

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => refresh(context, doc)),
    vscode.workspace.onDidChangeTextDocument((event) => refresh(context, event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => diagnostics.delete(document.uri)),
  );
}

export function deactivate(): void {
  diagnostics?.dispose();
}
