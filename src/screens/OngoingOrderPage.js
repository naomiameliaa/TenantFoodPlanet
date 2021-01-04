import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import SpinnerKit from '../components/SpinnerKit';
import {getData, normalize, alertMessage, removeData} from '../utils';
import {AuthContext} from '../../context';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
  },
  contentContainer: {
    height: '90%',
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  orderContainer: {
    backgroundColor: theme.colors.white,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  spinnerKitStyle: {
    marginTop: normalize(80),
  },
  emptyOrderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyOrderStyle: {
    width: normalize(220),
    height: normalize(220),
    marginTop: 0.15 * SCREEN_HEIGHT,
  },
  titleEmptyOrder: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginVertical: 10,
  },
  orderNum: {
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  orderNumBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notifyBtn: {
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnText: {
    color: theme.colors.white,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  detailWrapper: {
    marginBottom: 10,
  },
  horizontalWrapper: {
    flexDirection: 'row',
  },
  quantity: {
    fontWeight: 'bold',
    width: '10%',
  },
  txtStyle: {
    fontWeight: 'bold',
  },
  notesWrapper: {
    flexDirection: 'row',
    marginLeft: '10%',
  },
  notes: {
    flex: 1,
  },
  pickedUpBtn: {
    width: '40%',
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

function OngoingOrder({navigation}) {
  const [orderData, setOrderData] = React.useState([]);
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

  const renderItem = ({item, idx}) => {
    return (
      <TouchableOpacity
        style={styles.orderContainer}
        key={idx}
        onPress={() =>
          navigation.navigate('Order Detail', {
            orderNum: item.orderNum,
            transactionDate: item.date,
            status: item.status,
            totalPrice: item.totalPrice,
            dataOrder: item.detail,
          })
        }>
        <View style={styles.orderNumBtnWrapper}>
          <Text style={styles.orderNum}>Order No. {item.orderNum}</Text>
          <ButtonText
            title="Notify Customer"
            wrapperStyle={styles.notifyBtn}
            txtStyle={styles.btnText}
            onPress={() => setStatusReady(item.orderId)}
          />
        </View>
        {item.detail.map((itm, key) => {
          return (
            <View style={styles.detailWrapper} key={key}>
              <View style={styles.horizontalWrapper}>
                <Text style={styles.quantity}>{`${itm.quantity}x`}</Text>
                <Text style={styles.txtStyle}>{itm.menuName}</Text>
              </View>
              {itm.notes !== 'null' && (
                <View style={styles.notesWrapper}>
                  <Text style={styles.txtStyle}>Notes: </Text>
                  <Text style={styles.notes}>{itm.notes}</Text>
                </View>
              )}
            </View>
          );
        })}
        <ButtonText
          title="Picked up"
          wrapperStyle={styles.pickedUpBtn}
          txtStyle={styles.btnText}
          onPress={() => setStatusPickedUp(item.orderId)}
        />
      </TouchableOpacity>
    );
  };

  const signOutTenant = async () => {
    const removeLocalData = await removeData('tenantAdminData');
    if (removeLocalData) {
      signOut();
    }
  };

  async function logout() {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://food-planet.herokuapp.com/users/logout',
      );
      if (response.data.object === 'Logout success') {
        signOutTenant();
      }
    } catch (error) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Please try again later',
        btnText: 'Try Again',
        btnCancel: false,
      });
    }
    setIsLoading(false);
  }

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

  async function getOngoingOrder() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get(
        `https://food-planet.herokuapp.com/orders/tenant?tenantId=${tenantId}&status=PROCESSING&status=READY`,
      );
      if (response.data.msg === 'Query success') {
        setOrderData(response.data.object);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        sessionTimedOut();
      }
    }
    setIsLoading(false);
  }

  async function setStatusReady(orderId) {
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.post(
        `https://food-planet.herokuapp.com/orders/setFoodReady?orderId=${orderId}&tenantId=${tenantId}`,
      );
      if (response.data.msg === 'Query success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Success Notify Customer',
          btnText: 'OK',
          btnCancel: true,
        });
      }
    } catch (error) {
      console.log(error);
      alertMessage({
        titleMessage: 'Failed',
        bodyMessage: 'Please try again later!',
        btnText: 'Try Again',
        btnCancel: true,
      });
    }
  }

  async function setStatusPickedUp(orderId) {
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.post(
        `https://food-planet.herokuapp.com/orders/setOrderPickedUp?orderId=${orderId}&tenantId=${tenantId}`,
      );
      if (response.data.msg === 'Query success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Order Finished',
          btnText: 'OK',
          btnCancel: true,
        });
      }
    } catch (error) {
      console.log(error);
      alertMessage({
        titleMessage: 'Failed',
        bodyMessage: 'Please try again later!',
        btnText: 'Try Again',
        btnCancel: true,
      });
    }
  }

  React.useEffect(() => {
    getOngoingOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Ongoing Order" txtStyle={styles.titleText} />
        <ScrollView style={styles.contentContainer}>
          {isLoading ? (
            <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
          ) : (
            <View>
              {orderData.length === 0 ? (
                <View style={styles.emptyOrderContainer}>
                  <Image
                    source={require('../assets/dinner.png')}
                    style={styles.emptyOrderStyle}
                  />
                  <Text style={styles.titleEmptyOrder}>
                    There is No Ongoing Order
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={orderData}
                  renderItem={({item, idx}) => renderItem({item, idx})}
                  keyExtractor={(item) => item.orderId.toString()}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default OngoingOrder;
