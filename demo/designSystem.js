// @flow

type ColorName = string
type ColorValue = string
type Colors = { [ColorName]: ColorValue }

const colors: Colors = {
  selected: '#aaa',
  deselected: 'transparent',
  separator: '#eee',
  pressableText: 'blue',
  backgroundColor: 'white',
  overlayColor: 'transparent',
  boxTextColor: 'white',
  boxDefaultColor: 'black',
  boxDragColor: 'blue',
  boxSpringColor: 'red',
  artboardBackgroundColor: '#eee',
}

export default {
  colors,
  list: {
    item: {
      height: 40,
      separator: {
        color: colors.separator,
        width: 1
      }
    }
  }
}
