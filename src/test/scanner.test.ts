import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan } from '../scanner';

test('scan flags params.permit!', () => {
  const hits = scan('User.new(params.permit!)');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 1);
});

test('scan flags a _params-suffixed receiver', () => {
  const hits = scan('User.new(user_params.permit!)');
  assert.equal(hits.length, 1);
});

test('scan does not flag a real strong-parameters whitelist', () => {
  const hits = scan('User.new(params.require(:user).permit(:name, :email))');
  assert.equal(hits.length, 0);
});

test('scan ignores commented-out lines', () => {
  const hits = scan('# params.permit!');
  assert.equal(hits.length, 0);
});

test('scan tolerates spacing around the dot', () => {
  const hits = scan('params . permit!');
  assert.equal(hits.length, 1);
});
