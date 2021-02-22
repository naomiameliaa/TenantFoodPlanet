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
  orderNum: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: theme.colors.red,
    width: '70%',
  },
  boldStyle: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: theme.colors.red,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    width: '10%',
  },
  totalPrice: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
});

function PastOrder({navigation}) {
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

  const onRefresh = () => {
    setRefreshing(true);
    getPastOrder();
    setRefreshing(false);
  };

  const renderStatus = (status) => {
    if (status === 'PICKED_UP') {
      return 'PICKED UP';
    } else if (status === 'FINISHED') {
      return 'FINISHED';
    }
  };

  const renderPrice = (price) => {
    let i;
    let tempPrice = '';
    let ctr = 0;
    let stringPrice = price.toString();
    for (i = stringPrice.length - 1; i >= 0; i--) {
      tempPrice += stringPrice[i];
      ctr++;
      if (ctr === 3) {
        if (i > 1) {
          tempPrice += '.';
          ctr = 0;
        }
      }
    }
    let resPrice = '';
    for (i = tempPrice.length - 1; i >= 0; i--) {
      resPrice += tempPrice[i];
    }
    return resPrice;
  };

  const renderDate = (dateTime) => {
    let i = 0;
    let dates = '';
    let spaces = 0;
    for (; i < dateTime.length; i++) {
      dates += dateTime[i];
      if (dateTime[i] === ' ') {
        spaces++;
        if (spaces === 2) {
          return dates;
        }
      }
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
        <View style={styles.titleWrapper}>
          <Text style={styles.orderNum} numberOfLines={1}>
            Order No. {item.orderNum} ( {renderDate(item.date)})
          </Text>
          <Text style={styles.boldStyle}>{renderStatus(item.status)}</Text>
        </View>
        {item.detail.map((itm, key) => {
          return (
            <View style={styles.detailWrapper} key={key}>
              <View style={styles.horizontalWrapper}>
                <Text style={styles.quantity}>{`${itm.quantity}x`}</Text>
                <Text>{itm.menuName}</Text>
              </View>
            </View>
          );
        })}
        <Text style={styles.totalPrice}>
          {`TOTAL Rp ${renderPrice(item.totalPrice)}`}
        </Text>
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

  async function getPastOrder() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get(
        `https://food-planet.herokuapp.com/orders/tenant?tenantId=${tenantId}&status=PICKED_UP&status=FINISHED`,
      );
      if (response.data.msg === 'Query success') {
        setOrderData(response.data.object);
      }
    } catch (error) {
      sessionTimedOut();
      console.log(error);
      if (error.response.status === 401) {
        sessionTimedOut();
      }
    }
    setIsLoading(false);
  }

  React.useEffect(() => {
    getPastOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Past Order" txtStyle={styles.titleText} />
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
                    There is No Past Order
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

export default PastOrder;
