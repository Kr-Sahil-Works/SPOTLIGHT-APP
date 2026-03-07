import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
   <Stack screenOptions={{ headerShown: false}}/>
  </SafeAreaView>
  </SafeAreaProvider>
      
  )
}
