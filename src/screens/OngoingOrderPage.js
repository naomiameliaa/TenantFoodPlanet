import * as React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import { normalize, getData, removeData, alertMessage } from '../utils';
import SpinnerKit from '../components/SpinnerKit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  }
});

function OngoingOrder({ navigation }) {
  return (
    <Text>Ongoing Order</Text>
  );
}

export default OngoingOrder;