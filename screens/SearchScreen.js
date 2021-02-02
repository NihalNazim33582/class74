import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, KeyboardAvoidingView, Alert, FlatList} from 'react-native';
import * as firebase from 'firebase'
import db from '../Config.js'

export default class Searchscreen extends React.Component {
  constructor(){
    super()
    this.state={
      allTransactions:[],
      lastTransction:null,
      search:'',

    }
  }  
  
  fetchMoreTransaction = async ()=>{
    var text = this.state.search.toUpperCase();
    var enterText = text.split('')

    if(enterText[0].toUpperCase()==='B'){
      const Query= await db.collection('transaction').where('bookId','===',text).startAfter(
        this.state.lastTransction
      ).limit(10).get()
      Query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastTransction:doc
        })
      })
    }else if(enterText[0].toUpperCase()==='Students'){
      const Query= await db.collection('transaction').where('bookId','==',text).startAfter(
        this.state.lastTransction
      ).limit(10).get()
      Query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastTransction:doc
        })
      })
    }

  }

  searchTransaction = async (text)=>{
    var enterText=text.split('')
    if(enterText[0].toUpperCase() === 'B'){
      const variable= await db.collection('transaction').where('bookId','==',text).get()
      variable.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastTransction:doc
        })
      })
    }else if(enterText[0].toUpperCase() === 'Students'){
      const variable= await db.collection('transaction').where('StudentId','==',text).get()
      variable.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastTransction:doc
        })
      })
    }
  }

   componentDidMount = async ()=>{
    const Anything = await db.collection('transactions').get()
    Anything.docs.map((doc) =>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()]
      })
    })
  }

  render() {
      return (

        <View style={styles.container}>
        <View style={styles.searchBar}>
        <TextInput placeholder={'Enter Student of Book Id'} onChangeText={(text)=>{
          this.setState({
            search:text,

          })
        }} style={styles.bar}>
         
        </TextInput>
        <TouchableOpacity onPress={()=>{
            this.searchTransaction(this.state.search)
          }} style={styles.searchButton}>
          <Text> 'Search'
          </Text>
        </TouchableOpacity>
        </View>

        <FlatList data={this.state.allTransactions}
          renderItem={({index})=>{
            <View style={{borderBottomWidth: 3}}>
            <Text>{'Book Id:'+index.bookId}</Text>
            <Text>{'Student Id:'+index.studentId}</Text>
            <Text>{'Transaction Type:'+index.transactionType}</Text>
            <Text>{'Date:'+index.date}</Text>
          </View>
          }}
        
          keyExtractor={(index,item)=>item.toString()}

          onEndReached={this.fetchMoreTransaction}
          onEndReachedThreshold={0.5}
        >
        
        </FlatList>
        </View>
      );
    }
  }

  const styles=StyleSheet.create({
    bar:{ borderWidth:2, height:30, width:300, paddingLeft:10, },
    searchButton:{ borderWidth:1, height:30, width:50, alignItems:'center', justifyContent:'center', backgroundColor:'green' },
    searchBar:{ flexDirection:'row', height:40, width:'auto', borderWidth:0.5, alignItems:'center', backgroundColor:'grey', },
container: { flex: 1, marginTop: 20 },
  })
