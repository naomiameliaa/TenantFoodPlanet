import * as React from 'react';
import {View, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  btnText: {
    color: theme.colors.white,
    fontSize: 18,
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    width: SCREEN_WIDTH * 0.6,
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 10,
  },
});

function HomePage({navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* {
        isLoading ? (
          <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
        ) : ( */}
      <View style={{alignItems: 'center'}}>
        <Title text="Welcome, Tenant Name !" />
        <ButtonText
          title="Ongoing Order"
          txtStyle={styles.btnText}
          wrapperStyle={styles.btnWrapper}
          onPress={() => {
            navigation.navigate('Ongoing Order');
          }}
        />
        <ButtonText
          title="Past Order"
          txtStyle={styles.btnText}
          wrapperStyle={styles.btnWrapper}
          onPress={() => {
            navigation.navigate('Past Order');
          }}
        />
        <ButtonText
          title="My Menu"
          txtStyle={styles.btnText}
          wrapperStyle={styles.btnWrapper}
          onPress={() => {
            navigation.navigate('Manage Menu');
          }}
        />
        <ButtonText
          title="Change Password"
          txtStyle={styles.btnText}
          wrapperStyle={styles.btnWrapper}
          onPress={() => {
            navigation.navigate('Change Password');
          }}
        />
      </View>
      {/* )} */}
    </SafeAreaView>
  );
}

export default HomePage;
