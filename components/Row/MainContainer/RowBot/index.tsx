import React from 'react';
import {View, Switch} from 'react-native';
import { ProductProps} from '../../../../types';
import { FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import Colors from '../../../../constants/Colors';
import mystyle from '../../../../constants/mystyle';
import {handleOpen} from '../../../../utils/actions';

const RowBot = ({item}: ProductProps) => {

return (
<View style={mystyle.myClmContainer}>
    {item.isOpen? 
    <View style={[{marginBottom: 5}]}>
        <FontAwesome name="dropbox" size={50} color={Colors.light.gray} />
    </View>
    : <View style={[mystyle.centered, {marginBottom: 5}]}>
        <MaterialCommunityIcons name="cube" size={40} color={Colors.light.gray} />
      </View>
    }
      <Switch style={[{marginBottom: 10}]} trackColor={{ true: Colors.light.tint, false: Colors.light.tint}}
      thumbColor={Colors.light.tsecondary} ios_backgroundColor="white" onValueChange={() => handleOpen(item)}
      disabled={item.isOpen} value={item.isOpen}/>
</View>
)}

export default RowBot;