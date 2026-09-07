import * as vscode from 'vscode';
import { scan } from './scanner';

let diagnostics: vscode.DiagnosticCollection;

function refresh(document: vscode.TextDocument): void {
  if (document.languageId !== 'ruby' && !document.uri.path.endsWith('.rb')) return;

  const hits = scan(document.getText());
  const result = hits.map((hit) => {
    const range = new vscode.Range(hit.line - 1, 0, hit.line - 1, Number.MAX_SAFE_INTEGER);
    const diagnostic = new vscode.Diagnostic(
      range,
      'params.permit! disables Rails strong parameters entirely -- every current and future model attribute becomes mass-assignable, including ones never meant to be settable.',
      vscode.DiagnosticSeverity.Warning,
    );
    diagnostic.source = 'Rails Mass Assignment Companion';
    return diagnostic;
  });
  diagnostics.set(document.uri, result);
}

export function activate(context: vscode.ExtensionContext): void {
  diagnostics = vscode.languages.createDiagnosticCollection('railsMassAssignmentCompanion');
  context.subscriptions.push(diagnostics);

  vscode.workspace.textDocuments.forEach(refresh);

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument((event) => refresh(event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => diagnostics.delete(document.uri)),
  );
}

export function deactivate(): void {
  diagnostics?.dispose();
}
