import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import Title from '../components/Title';
import {normalize} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  horizontalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 6,
    marginTop: 10,
  },
  qtyStyle: {
    width: '12%',
  },
  menuName: {
    width: '65%',
  },
  priceStyle: {
    width: '35%',
  },
  txtStyle: {
    fontWeight: 'bold',
    fontSize: normalize(14),
    marginBottom: 12,
  },
  noteStyle: {
    marginLeft: '12%',
  },
  detailsWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: normalize(14),
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
});

function OrderDetail({route}) {
  const {
    orderNum,
    transactionDate,
    status,
    totalPrice,
    dataOrder,
  } = route.params;

  const renderStatus = (state) => {
    if (state === 'PROCESSING') {
      return 'Processing';
    } else if (state === 'READY') {
      return 'Ready';
    } else if (state === 'PICKED_UP') {
      return 'Picked Up';
    } else {
      return 'Finished';
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
        if (spaces === 3) {
          return dates;
        }
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View style={styles.horizontalWrapper}>
          <Text style={styles.qtyStyle}>{item.quantity}x</Text>
          <Text style={styles.menuName}>{item.menuName}</Text>
          <Text style={styles.priceStyle}>{renderPrice(item.menuPrice)}</Text>
        </View>
        {item.notes !== 'null' && (
          <Text style={styles.noteStyle}>Notes: {item.notes}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Order Details" txtStyle={styles.titleText} />
        <View>
          <Text style={styles.txtStyle}>Order Number : {orderNum}</Text>
          <Text style={styles.txtStyle}>
            Transaction Date : {renderDate(transactionDate)}
          </Text>
          <Text style={styles.txtStyle}>Status : {renderStatus(status)}</Text>
        </View>
        <ScrollView>
          <FlatList
            data={dataOrder}
            renderItem={({item, index}) => renderItem({item, index})}
            keyExtractor={(index) => index.toString()}
            style={styles.detailsWrapper}
          />
        </ScrollView>
        <Text style={styles.txtStyle}>
          Total : Rp. {renderPrice(totalPrice)}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default OrderDetail;
