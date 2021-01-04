import * as React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import SpinnerKit from '../components/SpinnerKit';
import {getData, normalize, alertMessage, removeData} from '../utils';
import {AuthContext} from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boxContainer: {
    flex: 1,
    margin: 10,
    height: normalize(200),
  },
  titleText: {
    fontSize: normalize(25),
    margin: 10,
  },
  btnText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: normalize(15),
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    padding: normalize(10),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgMenuStyle: {
    width: '100%',
    height: normalize(130),
    marginRight: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuNameWrapper: {
    backgroundColor: theme.colors.red,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  menuName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: normalize(14),
    paddingVertical: 5,
    color: theme.colors.white,
  },
  menuWrapper: {
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconStyle: {
    width: normalize(20),
    height: normalize(20),
  },
  spinnerKitStyle: {
    marginTop: normalize(80),
  },
});

function ManageMenu({navigation}) {
  const [menuData, setMenuData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const {signOut} = React.useContext(AuthContext);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (dataTenantAdmin) {
      return dataTenantAdmin.tenantId;
    } else {
      return null;
    }
  };

  const logout = async () => {
    const dataUser = await getData('tenantAdminData');
    if (dataUser !== null) {
      await removeData('tenantAdminData');
      await signOut();
    }
  };

  function sessionTimedOut() {
    alertMessage({
      titleMessage: 'Session Timeout',
      bodyMessage: 'Please re-login',
      btnText: 'OK',
      onPressOK: () => {
        logout();
      },
      btnCancel: false,
    });
  }

  async function getMenuData() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get(
        'https://food-planet.herokuapp.com/menu/tenant',
        {
          params: {
            tenantId: tenantId,
          },
        },
      );
      if (response.data.msg === 'Query success') {
        setMenuData(response.data.object);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        sessionTimedOut();
      }
    }
    setIsLoading(false);
  }

  async function deleteMenu(menuId) {
    try {
      const response = await axios.delete(
        'https://food-planet.herokuapp.com/menu/delete',
        {
          params: {
            menuId: menuId,
          },
        },
      );
      if (response.status === 200) {
        await getMenuData();
        alertMessage({
          titleMessage: 'Success!',
          bodyMessage: 'Succeed delete menu.',
          btnText: 'OK',
          btnCancel: true,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        sessionTimedOut();
      } else {
        alertMessage({
          titleMessage: 'Failed!',
          bodyMessage: 'Failed delete menu, Please try again later.',
          btnText: 'Try Again',
          btnCancel: true,
        });
      }
      console.log(error);
    }
  }

  function remove(menuId) {
    alertMessage({
      titleMessage: 'Warning !',
      bodyMessage: 'Are you sure to delete this menu ?',
      btnText: 'No',
      secondBtnText: 'Yes',
      secondOnPressOK: () => deleteMenu(menuId),
      btnCancel: false,
    });
  }

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={styles.boxContainer}>
        <View style={styles.menuWrapper}>
          <Image
            resizeMode="cover"
            style={styles.imgMenuStyle}
            source={{uri: `data:image/jpeg;base64,${item.image}`}}
          />
          <View style={styles.menuNameWrapper}>
            <Text style={styles.menuName}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <ButtonKit
            btnStyle={styles.iconStyle}
            source={require('../assets/view-icon.png')}
            onPress={() => {
              navigation.navigate('Menu Detail', {
                menuName: item.name,
                menuDescription: item.description,
                menuPrice: item.price,
                menuImage: item.image,
              });
            }}
          />
          <ButtonKit
            btnStyle={styles.iconStyle}
            source={require('../assets/edit.png')}
            onPress={() => {
              navigation.navigate('Edit Menu', {
                menuId: item.menuId,
                menuName: item.name,
                menuDescription: item.description,
                menuPrice: item.price,
                menuImage: item.image,
                getMenuData: getMenuData,
              });
            }}
          />
          <ButtonKit
            btnStyle={styles.iconStyle}
            source={require('../assets/delete-icon.png')}
            onPress={() => remove(item.menuId)}
          />
        </View>
      </View>
    );
  };

  React.useEffect(() => {
    getMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Title txtStyle={styles.titleText} text="My Menu" />
          <ButtonText
            title="Add Menu"
            txtStyle={styles.btnText}
            wrapperStyle={styles.btnWrapper}
            onPress={() => {
              navigation.navigate('Add Menu', {
                getMenuData: getMenuData,
              });
            }}
          />
        </View>
        <ScrollView>
          {isLoading ? (
            <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
          ) : (
            <FlatList
              data={menuData}
              renderItem={({item, index}) => renderItem({item, index})}
              keyExtractor={(item) => item.menuId.toString()}
              numColumns={2}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default ManageMenu;
