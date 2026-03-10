import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function GreenLoader() {

  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate,{
        toValue:1,
        duration:1200,
        easing:Easing.linear,
        useNativeDriver:true
      })
    ).start();
  },[]);

  const spin = rotate.interpolate({
    inputRange:[0,1],
    outputRange:["0deg","360deg"]
  });

  return(
    <Animated.View style={{width:24,height:24,transform:[{rotate:spin}]}}>
      <Svg viewBox="0 0 240 240">
        <Circle cx="120" cy="120" r="90" stroke="#16a34a" strokeWidth="18" fill="none" strokeDasharray="200 420"/>
        <Circle cx="120" cy="120" r="70" stroke="#22c55e" strokeWidth="18" fill="none" strokeDasharray="150 320"/>
        <Circle cx="120" cy="120" r="50" stroke="#4ade80" strokeWidth="18" fill="none" strokeDasharray="100 220"/>
      </Svg>
    </Animated.View>
  );
}