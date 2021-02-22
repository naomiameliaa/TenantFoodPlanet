import * as React from 'react';
import {View, SafeAreaView, Image, StyleSheet} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {getData, normalize, alertMessage, removeData, deleteFcmToken} from '../utils';
import {AuthContext} from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(20),
  },
  logoutTxt: {
    color: theme.colors.red,
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  logoutWrapper: {
    alignSelf: 'flex-end',
    width: 90,
  },
  titleStyle: {
    fontSize: normalize(20),
    textAlign: 'center',
    marginTop: normalize(20),
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
    fontSize: normalize(14),
    fontWeight: 'bold',
    textAlign: 'center',
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
  const [isLoadingLogout, setisLoadingLogout] = React.useState(false);
  const {signOut} = React.useContext(AuthContext);
  const [tenantName, setTenantName] = React.useState('');

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (dataTenantAdmin) {
      setTenantName(dataTenantAdmin.tenantName);
    }
  };

  const signOutTenant = async () => {
    await deleteFcmToken();
    const removeLocalData = await removeData('tenantAdminData');
    if (removeLocalData) {
      signOut();
    }
  };

  async function logout() {
    setisLoadingLogout(true);
    try {
      const response = await axios.post(
        'https://food-planet.herokuapp.com/users/logout',
      );
      if (response.data.object === 'Logout success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Logout success!',
          btnText: 'OK',
          onPressOK: () => signOutTenant(),
          btnCancel: false,
        });
      }
    } catch (error) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Please try again later',
        btnText: 'Try Again',
        btnCancel: false,
      });
    }
    setisLoadingLogout(false);
  }

  React.useEffect(() => {
    getDataTenantAdmin();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ButtonText
          title="Log out"
          txtStyle={styles.logoutTxt}
          onPress={() => logout()}
          wrapperStyle={styles.logoutWrapper}
          isLoading={isLoadingLogout}
          colorSpinner={theme.colors.red}
        />
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
