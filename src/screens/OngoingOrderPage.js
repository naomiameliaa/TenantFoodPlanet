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
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import SpinnerKit from '../components/SpinnerKit';
import {getData, normalize, alertMessage, removeData, deleteFcmToken} from '../utils';
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
    color: theme.colors.red,
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
  orderText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: theme.colors.red,
  },
  orderNumTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  btnText: {
    color: theme.colors.white,
    fontSize: normalize(12),
    fontWeight: 'bold',
    textAlign: 'center',
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
  buttonWrapperHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  notifyBtn: {
    width: '40%',
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pickedUpBtn: {
    width: '40%',
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pickedUpBtnDisabled: {
    width: '40%',
    backgroundColor: theme.colors.red_20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

function OngoingOrder({navigation}) {
  const [orderData, setOrderData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
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

  const renderTime = (dateTime) => {
    let i = 0;
    let times = '';
    let spaces = 0;
    for (; i < dateTime.length; i++) {
      if (dateTime[i] === ' ') {
        spaces++;
      } else if (spaces === 3) {
        times += dateTime[i];
      }
    }
    return times;
  };

  const onRefresh = () => {
    setRefreshing(true);
    getOngoingOrder();
    setRefreshing(false);
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
        <View style={styles.orderNumTimeWrapper}>
          <Text style={styles.orderText}>Order No. {item.orderNum}</Text>
          <Text style={styles.orderText}>{renderTime(item.date)}</Text>
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
        <View style={styles.buttonWrapperHorizontal}>
          <ButtonText
            title="Notify Customer"
            wrapperStyle={styles.notifyBtn}
            txtStyle={styles.btnText}
            onPress={() => setStatusReady(item.orderId)}
          />
          <ButtonText
            title="Picked up"
            wrapperStyle={
              item.status === 'PROCESSING'
                ? styles.pickedUpBtnDisabled
                : styles.pickedUpBtn
            }
            txtStyle={styles.btnText}
            onPress={() => setStatusPickedUp(item.orderId)}
            disabled={item.status === 'PROCESSING' ? true : false}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const logout = async () => {
    await deleteFcmToken();
    const dataTenant = await getData('tenantAdminData');
    if (dataTenant !== null) {
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
      if (response.data.msg === 'Success Send Notification') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Success Notify Customer',
          btnText: 'OK',
          onPressOK: () => getOngoingOrder(),
          btnCancel: true,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        sessionTimedOut();
      } else {
        alertMessage({
          titleMessage: 'Failed',
          bodyMessage: 'Please try again later!',
          btnText: 'Try Again',
          btnCancel: true,
        });
      }
    }
  }

  async function setStatusPickedUp(orderId) {
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.post(
        `https://food-planet.herokuapp.com/orders/setOrderPickedUp?orderId=${orderId}&tenantId=${tenantId}`,
      );
      if (response.data.msg === 'Success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Order Finished',
          btnText: 'OK',
          onPressOK: () => getOngoingOrder(),
          btnCancel: true,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        sessionTimedOut();
      } else {
        alertMessage({
          titleMessage: 'Failed',
          bodyMessage: 'Please try again later!',
          btnText: 'Try Again',
          btnCancel: true,
        });
      }
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
        <ScrollView
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }>
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
