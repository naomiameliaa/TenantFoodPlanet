import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  btnWrapper: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.black,
  },
});

function ButtonText({title, onPress, txtStyle, wrapperStyle}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btnWrapper, wrapperStyle]}>
      <Text style={[styles.title, txtStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default ButtonText;
