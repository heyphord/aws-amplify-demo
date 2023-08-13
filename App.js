import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
//aws amplify imports
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';

import { createBlog } from "./src/graphql/mutations";
import { listBlogs } from "./src/graphql/queries";

import awsconfig from './aws-exports';
import React from 'react';
Amplify.configure(awsconfig);



export default function App() {

  const [isLoading , setLoading] = React.useState(false);
  const [blogs , setBlogs] = React.useState([]);
  const [error , setError] = React.useState({});

  const addBlogFxn = async()=>{
    try {
      
      setLoading(true);
      const createdTodo = await API.graphql({
        query: createBlog,
        variables: {input: { name: 'My 3rd blog!' }},
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });
      
  
      console.log(createdTodo);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.log(error);
      
    }
  }
  
  const listBlogsFxn = async()=>{
    
    try {
      setLoading(true)
      // const result = await API.graphql(graphqlOperation(listBlogs))
      const result = await API.graphql({
        query: listBlogs,
        // variables: {input: { name: 'My 2nd blog!' }},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,

      });
      
      setBlogs(result.data.listBlogs.items)
      console.log(result.data.listBlogs.items)
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      setError(error)
      console.log(error);
      
    }
  }

  return (
    <View style={styles.container}>
      <Text>Demo App to test AWS Amplify {isLoading ? <ActivityIndicator/> : null}</Text>
      

      <StatusBar style="auto" />
      <View style={{borderWidth:1}}>

        <Button onPress={addBlogFxn} title="Add Blog"/>
        <Button onPress={listBlogsFxn} title="List Blogs"/>
      </View>


      <View style={{borderWidth:1}}>
        <Text>List of blogs titles</Text>
        {blogs.map( (value, index) => <Text>{value.name}</Text>)}
      </View>
      <View style={{borderWidth:1}}>
        <Text>Error message:  {error.message}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
