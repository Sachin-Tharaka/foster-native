import React,{ useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'; // Example using react-native-elements for icons
import { FontAwesome } from '@expo/vector-icons';


const AgentWallet = ({ navigation }) => {

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };
  // Dummy data for transaction history
  const transactions = [
    { id: 1, name: 'Imahsa pet', type: 'Deposit', amount: '+ Rs5910.00', date: 'Today, Mar 20' },
    { id: 2, name: 'Items', type: 'Payment', amount: '- Rs1500.99', date: 'Today, Mar 20' },
    { id: 3, name: 'Nadun pet', type: 'Deposit', amount: '+ Rs2045.00', date: 'Today, Mar 20' },
    { id: 4, name: 'Kavindu pet', type: 'Deposit', amount: '+ Rs2550.99', date: 'Yesterday, Dec 28' },
    { id: 5, name: 'Wages', type: 'Payment', amount: '- Rs2500.00', date: 'Yesterday, Dec 28' }
  ];

  return (

    <View style={styles.container}>
    <ScrollView style={styles.content}>
      <TouchableOpacity style={styles.menuIcon} onPress={toggleNavbar}>
        <FontAwesome name={isCollapsed ? 'bars' : 'times'} size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Wallet</Text>

      <View style={styles.balanceSection}>
        <Text style={styles.balanceText}>Current balance</Text>
        <Text style={styles.balanceAmount}>Rs.12,256.00</Text>
        <Text style={styles.accountNumber}>Bank account: 2564 8546 8421 1121</Text>
        <TouchableOpacity style={styles.changeAccountButton}>
          <Text style={styles.buttonText}>Change Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionHeader}>
        <Text style={styles.headerText}>Transaction history</Text>
        <Icon name='search' type='font-awesome' color='#000' />
      </View>

      {transactions.map(transaction => (
        <View key={transaction.id} style={styles.transactionItem}>
          <Icon name={transaction.type === 'Deposit' ? 'arrow-down' : 'arrow-up'} type='font-awesome' color={transaction.type === 'Deposit' ? 'green' : 'red'} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>{transaction.name}</Text>
            <Text style={styles.transactionAmount}>{transaction.amount}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
      ))}
    </ScrollView>

    
    {!isCollapsed && (
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.closeIcon} onPress={toggleNavbar}>
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navItem} onPress={() => navigation.navigate('AgentHome')}>Home</Text>
        <Text style={styles.navItem} onPress={() => navigation.navigate('AgentApprovals')}>Bookings</Text>
        <Text style={styles.navItem} onPress={() => navigation.navigate('AgentChat')}>Chats</Text>
        <Text style={styles.navItem} onPress={() => navigation.navigate('AgentWallet')}>Wallet</Text>
      </View>
    )}
  </View>



    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop:60
  },
  balanceSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  balanceText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5
  },
  accountNumber: {
    fontSize: 16,
    marginBottom: 10
  },
  changeAccountButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10  // Add margin to avoid overlap with the menu icon
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  transactionDetails: {
    marginLeft: 10
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  transactionAmount: {
    fontSize: 16
  },
  transactionDate: {
    fontSize: 14,
    color: '#666'
  },
  content: {
    flex: 1,
    padding: 20,

  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  user_header: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  detailContainer: {
    flex: 1
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  role: {
    fontSize: 14,
    color: '#666'
  },
  detail: {
    fontSize: 12,
    color: '#999'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom:10
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  buttonSmall: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5
  },
  buttonSmallBlue: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold'
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#FFF'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50  // Add margin to avoid overlap with the menu icon
  },
  sidebar: {
    position: 'absolute',
    width: 200,
    height: '100%',
    backgroundColor: '#2C3E50',
    paddingTop: 20,
    left: 0,
    top: 0
  },
  navItem: {
    padding: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2
  }
});

export default AgentWallet;
