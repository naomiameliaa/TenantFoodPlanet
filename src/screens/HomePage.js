import * as React from 'react';
import {View, SafeAreaView, Image, StyleSheet, Dimensions} from 'react-native';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {getData, normalize} from '../utils';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(20),
  },
  soundBtn: {
    width: 40,
    height: 40,
  },
  logoutTxt: {
    color: theme.colors.red,
    fontWeight: 'bold',
    fontSize: 22,
  },
  titleStyle: {
    fontSize: normalize(20),
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(40),
  },
  horizontalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(20),
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: 130,
    height: 130,
  },
  btnText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    width: 150,
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 10,
  },
});

function HomePage({navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSoundOn, setIsSoundOn] = React.useState(true);
  let tenantName;

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (dataTenantAdmin !== null) {
      tenantName = dataTenantAdmin.tenantName;
    }
  };

  React.useEffect(() => {
    getDataTenantAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.horizontalWrapper}>
          {isSoundOn ? (
            <ButtonKit
              source={require('../assets/alarm-on.png')}
              wrapperStyle={styles.soundBtn}
              onPress={() => setIsSoundOn(false)}
            />
          ) : (
            <ButtonKit
              source={require('../assets/alarm-off.png')}
              wrapperStyle={styles.soundBtn}
              onPress={() => setIsSoundOn(true)}
            />
          )}
          <ButtonText title="Log out" txtStyle={styles.logoutTxt} />
        </View>
        <Title text={`Welcome, ${tenantName}!`} txtStyle={styles.titleStyle} />
        <View style={styles.horizontalWrapper}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/ongoing.png')}
              style={styles.iconStyle}
            />
            <ButtonText
              title="Ongoing Order"
              txtStyle={styles.btnText}
              wrapperStyle={styles.btnWrapper}
              onPress={() => {
                navigation.navigate('Ongoing Order');
              }}
            />
          </View>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/past.png')}
              style={styles.iconStyle}
            />
            <ButtonText
              title="Past Order"
              txtStyle={styles.btnText}
              wrapperStyle={styles.btnWrapper}
              onPress={() => {
                navigation.navigate('Past Order');
              }}
            />
          </View>
        </View>
        <View style={styles.horizontalWrapper}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/menu.png')}
              style={styles.iconStyle}
            />
            <ButtonText
              title="My Menu"
              txtStyle={styles.btnText}
              wrapperStyle={styles.btnWrapper}
              onPress={() => {
                navigation.navigate('Manage Menu');
              }}
            />
          </View>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/password.png')}
              style={styles.iconStyle}
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
        </View>
      </View>
    </SafeAreaView>
  );
}

export default HomePage;
