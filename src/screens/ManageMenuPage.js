import * as React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {normalize, getData, alertMessage} from '../utils';
import SpinnerKit from '../components/SpinnerKit';
import {FlatList} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    fontSize: normalize(16),
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    padding: normalize(10),
    height: normalize(35),
    borderRadius: 10,
  },
  imgMenuStyle: {
    width: '100%',
    height: normalize(130),
    marginRight: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: normalize(14),
    paddingVertical: 5,
    backgroundColor: theme.colors.red,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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

  React.useEffect(() => {
    getMenuData();
  }, []);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (getDataTenantAdmin !== null) {
      return dataTenantAdmin.tenantId;
    } else {
      return null;
    }
  };

  async function getMenuData() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get('http://172.18.0.1:8080/menu/tenant', {
        params: {
          tenantId: tenantId,
        },
        auth: {
          username: 'tenantAdmin@mail.com',
          password: 'password',
        },
      });
      if (response.data.msg === 'Query success') {
        setMenuData(response.data.object);
        console.log('MENU DATA: ', response.data.object);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  async function deleteMenu(menuId) {
    try {
      const response = await axios.delete(
        'http://172.18.0.1:8080/menu/delete',
        {
          params: {
            menuId: menuId,
          },
        },
      );
      if (response.status === 200) {
        getMenuData();
      }
    } catch (error) {
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
      btnCancel: true,
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
          <Text style={styles.menuName}>{item.name}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Title txtStyle={styles.titleText} text="My Menu" />
        <ButtonText
          title="Add Menu"
          txtStyle={styles.btnText}
          wrapperStyle={styles.btnWrapper}
          onPress={() => {
            navigation.navigate('Add Menu');
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
    </SafeAreaView>
  );
}

export default ManageMenu;
