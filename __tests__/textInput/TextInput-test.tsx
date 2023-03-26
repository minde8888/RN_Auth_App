import React from 'react';
import renderer from 'react-test-renderer';
import TextInput from '../../src/components/textInput/TextInput';

test('TextInput component > renders correctly with props { label: "Name", name: "name", defaultValue: "John" }', () => {
  const tree = renderer.create(
    <TextInput label="Name" name="name" defaultValue="John" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});