// @flow
import * as React from 'react'
import { View, StyleSheet } from 'react-native'

import NavBar from './NavBar'
import { type ViewsType } from './ViewsType'

type Navigator = {
  navigate: Function
}

type Props = {
  /*
   * Option name as string for the component
   */
  name?: string,
  /*
   * Name of the property from 'views' that is the initial view for the
   * navigator
   */
  root: string | Array<string>,
  views: ViewsType,
  /*
   * Function to determine the back label for the navigator, receives the
   * current stack depth as an argument (zero based)
   */
  backLabel?: Function,
  /*
   * Optional styles to be added to the navigator
   */
  style: StyleSheet.StyleProp,
  /*
   * Optional function to handle what happens when the back button is
   * pressed.  The function is provided a 'next' argument, which is
   * a function that links to the default handler, so that onBack can
   * be supplemented. Default is to pop from the stack.
   */
  onBack?: Function,
  /*
   * Allows navigator to be reconfigured
   */
  navigator?: Navigator,

}

type StackItem = {
  name: string,
  view: View,
  props?: Object,
  renderElement: Function,
}

type State = {
  stack: Array<StackItem>
}

type BackHandler = (depth: number) => void
type NextCallback = (next: Function) => void

export default class StackNavigator extends React.Component<Props, State> {

  state = {
    stack: []
  }

  getView(name: string, otherProps?: Object = {}): StackItem {
    const view = this.props.views[name]
    const { component: Component, props = {}, handlers = {} } = view
    const navHandlers = {}
    const navigator = {
      navigate: this.navigate,
      ...this.props.navigator
    }
    Object.getOwnPropertyNames(handlers).forEach(name => {
      navHandlers[name] = (...args) => handlers[name](...args, navigator)
    })

    return {
      name,
      view,
      props: { ...props, ...otherProps, ...navHandlers },
      renderElement: () => (
        <Component
          {...props}
          {...otherProps}
          {...navHandlers}
        />
      )
    }
  }

  navigate = (name: string, props: Object, index: number): void => {
    this.setState(state => ({
        stack: [
          ...state.stack.slice(0, index),
          this.getView(name, props)
        ]
      }
    ))
  }

  pop = (): void => {
    this.setState(() => ({
        stack: this.state.stack.slice(0, -1)
      }
    ))
  }

  componentWillMount() {
    const rootArray: Array<string> = Array.isArray(this.props.root) ? this.props.root : [ this.props.root ]
    const viewArray: Array<StackItem> = rootArray.map(view => this.getView(view))
    this.setState(() => ({
        stack: viewArray.filter(view => !!view)
      }
    ))
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState(state => ({
        stack: state.stack.map(view => (
          this.getView(view.name, { ...view.props, ...newProps.views[view.name].props })
        ))
      }
    ))
  }

  static backLabel(depth: number): string | null {
    return depth > 1 ? '<' : null
  }

  handleBack = () => {
    const { view } = this.state.stack.slice(-1).pop()
    const next: NextCallback = next => next()
    const onBack: BackHandler = (this.props.onBack || next).bind(null, (view.onBack || next).bind(null, this.pop))
    onBack(this.state.stack.length)
  }

  render() {
    const { view, renderElement, props } = this.state.stack.slice(-1).pop()
    const { backLabel = StackNavigator.backLabel } = this.props

    return (
      <View style={this.props.style} name={this.props.name || 'StackNavigator'}>
        <NavBar
          backLabel={backLabel(this.state.stack.length)}
          title={typeof view.title === 'function' && view.title(props) || view.title || "--No Title--"}
          onBack={this.handleBack}
        />
        {renderElement()}
      </View>
    )
  }
}
