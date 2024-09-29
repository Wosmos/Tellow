import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

it(`renders correctly`, () => {
  const tree = renderer.create(<Text style={{color: '#11181C', fontSize: 16, lineHeight: 24}}>Snapshot test!</Text>).toJSON();

  // expect(tree).toMatchSnapshot();
});
