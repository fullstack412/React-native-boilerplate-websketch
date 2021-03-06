// @flow
import * as React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { SplitNavigator, type DisplayMode } from '../Navigators'

import DraggableBox from '../DraggableBox'
import HelloWorld from '../HelloWorld'
import LockScreenApp from '../LockScreen'
import TodoList from '../Todo/TodoList'
import TodoDetail from '../Todo/TodoDetail'
import DemoList from './DemoList'
import TextWrap from '../TextWrap'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  splitNavigator: {
  },
  textWrapView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  textWrapText: {
    textAlign: 'center',
  },
  todoDetail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type Props = {
  /*
   * function to handle a demo item being pressed
   */
  onDemoItemPress: Function,
  /*
   * currently selected item from data
   */
  selected: ?Object,
  /*
   * handler for navigator changing mode, receives mode and newMode as
   * arguments
   */
  onModeChange: Function,
}

class DemoApp extends React.Component<Props> {

  static defaultProps = {
    onDemoItemPress: (demo, navigator, props, next) => { next(demo, navigator, props) },
    onModeChange: () => null
  }

  navigator: ?SplitNavigator

  // eslint-disable-next-line class-methods-use-this
  onDemoItemPress = (demo, navigator, props) => {
    navigator.navigate(demo.view, props)
  }

  navigatorRef = ref => this.navigator = ref

  render() {
    const selected = this.props.selected || (this.navigator && !this.navigator.isStacked ? { key: 0 } : null)
    return (
      <SafeAreaView
        name="SafeAreaView"
        style={styles.safeArea}
      >

        <SplitNavigator
          ref={this.navigatorRef}
          master="DemoList"
          detail="HelloWorld"
          onModeChange={this.props.onModeChange}
          views={{
            DemoList: {
              component: DemoList,
              title: "Demos",
              props: {
                selected,
                data: [
                {
                  key: 0,
                  title: 'HelloWorld',
                  view: 'HelloWorld'
                },
                {
                  key: 1,
                  title: 'Draggable Box',
                  view: 'DraggableBox'
                },
                {
                  key: 2,
                  title: 'Lock Screen',
                  view: 'LockScreenApp'
                },
                {
                  key: 3,
                  title: 'Todo List',
                  view: 'TodoList'
                },
                {
                  key: 4,
                  title: 'Text Wrap',
                  view: 'TextWrap'
                },
                ]
              },
              handlers: {
                onItemPress: (demo, navigator) => this.props.onDemoItemPress(demo, navigator, { title: demo.title }, this.onDemoItemPress)
              },
            },
            HelloWorld: {
              component: HelloWorld,
              title: props => props.title || 'HelloWorld',
              props: {},
            },
            DraggableBox: {
              component: DraggableBox,
              title: props => props.title,
              props: {},
            },
            LockScreenApp: {
              component: LockScreenApp,
              title: props => props.title,
              props: {
                styles: {
                  lockscreen: {
                  }
                }
              },
            },
            TextWrap: {
              component: TextWrap,
              title: props => props.title || 'TextWrap',
              props: {
                viewStyle: styles.textWrapView,
                textStyle: styles.textWrapText
              },
            },
            TodoList: {
              component: TodoList,
              title: props => props.title,
              props: {
                items: [
                { id: 0, title: 'Bread' },
                { id: 1, title: 'Milk' },
                { id: 2, title: 'Cheese' },
                ]
              },
              handlers: {
                onItemPress: (item, navigator) => navigator.navigate('TodoDetail', { ...item })
              },
            },
            TodoDetail: {
              component: TodoDetail,
              title: props => props.title,
              props: {
                style: styles.todoDetail,
              },
            },
          }}
          style={styles.splitNavigator}
        />
      </SafeAreaView>
    )
  }
}

type StatefulDemoAppState = {
  selected: ?Object
}

// eslint-disable-next-line react/no-multi-comp
export default class StatefulDemoApp extends React.Component<*, StatefulDemoAppState> {

  constructor(props: *) {
    super(props)
    this.state = {
      selected: null
    }
  }

  handleDemoItemPress = (demo: Object, navigator: Object, props: Object, next: Function) => {
    this.setState(() => ({ selected: demo }))
    next(demo, navigator, props)
  }

  handleModeChange = (mode: DisplayMode, newMode: DisplayMode) => {
    if (mode === SplitNavigator.DisplayMode.Initial || newMode === SplitNavigator.DisplayMode.Stacked) {
      this.setState(() => ({ selected: null }))
    }
  }

  render() {
    return (
      <DemoApp
        onDemoItemPress={this.handleDemoItemPress}
        selected={this.state.selected}
        onModeChange={this.handleModeChange}
      />
    )
  }
}
