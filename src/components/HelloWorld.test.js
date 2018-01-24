import React from 'react'
import 'react-native'
import { Text, StyleSheet } from 'react-native'
import { shallow } from 'enzyme';

import HelloWorld from '../../src/components/HelloWorld'

describe('HelloWorld', () => {

  class SUT {
    constructor() {
      this.sut = shallow(<HelloWorld />)
    }

    hasHelloWorldMessage() {
      return this.sut.contains('Hello World')
    }

    get containerStyle() {
      return StyleSheet.flatten(this.sut.props().style)
    }

    get textStyle() {
      return StyleSheet.flatten(this.sut.find(Text).props().style)
    }
  }

  test('renders Hello World message', () => {
    const sut = new SUT()
    expect(sut.hasHelloWorldMessage).toBeTruthy()
  })

  test('renders container styles', () => {
    const sut = new SUT()
    expect(sut.containerStyle).toEqual(expect.objectContaining({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }))
  })

  test('renders text styles', () => {
    const sut = new SUT()
    expect(sut.textStyle).toEqual(expect.objectContaining({
      fontSize: 30
    }))
  })

})
