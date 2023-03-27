import {configureStore} from '@reduxjs/toolkit';
import {renderHook} from '@testing-library/react-hooks';
import {Provider} from 'react-redux';
import rootReducer from '../../src/redux/reducers';
import {store, useAppDispatch} from '../../src/redux/store';
import {createElement} from 'react';

describe('store', () => {
  test('store is configured correctly', () => {
    const store = configureStore({reducer: {data: rootReducer}});
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
    expect(state.data).toBeDefined();
    expect(typeof state.data).toBe('object');
  });
});

describe('useAppDispatch', () => {
  test('returns a dispatch function', () => {
    const {result} = renderHook(() => useAppDispatch(), {
      wrapper: ({children}: {children?: null | undefined}) =>
        createElement(Provider, {store, children}),
    });

    const dispatch = result.current;
    expect(dispatch).toBeDefined();
    expect(typeof dispatch).toBe('function');
  });
});
