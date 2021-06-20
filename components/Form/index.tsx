import * as React from 'react';
import { useState} from 'react';
import { View, Text,TouchableOpacity, Platform, Pressable} from 'react-native';
import Colors from '../../constants/Colors'
import { DatePickerModal } from 'react-native-paper-dates';
import {FormProps} from '../../types';
import mystyle from '../../constants/mystyle'
import TextField from './TextField/index';
import {handleBarCodeScanned} from '../../utils/query';
import DotList from './DotList';
import MyButton from '../Button';
import MyScanner from './Scanner';
import DateTimePicker from '@react-native-community/datetimepicker';

const Form = ({onDataReady, product, editor}:FormProps)  => {
  const [datepick, setDatepick] = useState<Date>(product? new Date(product.expiry) : new Date());
  const [scanner, setScanner] = useState<boolean>(false);
  const [inputsArray, setInputsArray] = useState<string[]>(product?
  [product.name, product.brand? product.brand : '', product.category? product.category : '', 
  product.location? product.location : '', product.confection? product.confection : '', 
  product.maturity? product.maturity : ''] : ['','','','','', '']);

  const confectionsWFresh:Array<string> = ['Fresh','Box', 'Canned', 'Bag', 'Liquid', 'Cured'];
  const confectionsWOFresh:Array<string> = confectionsWFresh.slice(1);
  const ripeness:Array<string>  = ['Underripe', 'Barely Ripe', 'Ripe', 'Very Ripe', 'Overripe'];

  const handleUpdate = (val:string,i:number) => {
    //handling update of each value inside the inputs array
    let items = [...inputsArray]; items[i] = val; setInputsArray(items);
  }
  
  const handleAll = (myName:string, myBrand:string, myCategory:string) => {
    //Saving scanned values in inputs
    let items = [...inputsArray]; 
    items[0] = myName;
    items[1] = myBrand;
    items[2] = myCategory;
    setInputsArray(items);
  }

  const handleCodeScanned = async ({data}:any) => {
      try{
      const resultArray:Array<string> | undefined = await handleBarCodeScanned(data);
      if(resultArray){
        handleAll(resultArray[0], resultArray[1], resultArray[2]);
      } else handleAll('Name not found', 'Brand nor found', 'Category not found');
      setScanner(false)}
      catch(err) {
        console.log("error", err)
    }
  };


  const [show, setShow] = useState(false);
 
	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || datepick;
		setDatepick(currentDate);
		setShow(Platform.OS === 'ios');
	};
 
	const showMode = () => {
		setShow(!show);
	};
 
	const showDatepicker = () => {
		showMode();
	};

  
  return (
  <View style={[mystyle.myFormContainer, mystyle.centered, mystyle.myShadow]}>
    {editor? <Text style={[mystyle.myHeaderText, mystyle.centered, mystyle.blackText, mystyle.stnText]}>Edit {inputsArray[0]}</Text>
    : <Text style={[mystyle.myHeaderText, mystyle.centered, mystyle.blackText, mystyle.stnText]}>Add Ingredient</Text>}
    <View style={{flexDirection: 'row'}}>
      <TextField handleUpdate={handleUpdate} titleArr={inputsArray} arrIndex={0} placeHold={"Name"}></TextField>
      <TextField handleUpdate={handleUpdate} titleArr={inputsArray} arrIndex={1} placeHold={"Brand"}></TextField>
    </View>
    <View style={{flexDirection: 'row'}}>
      <TextField handleUpdate={handleUpdate} titleArr={inputsArray} arrIndex={2} placeHold={"Category"}></TextField>
      <TextField handleUpdate={handleUpdate} titleArr={inputsArray} arrIndex={3} placeHold={"Location"}></TextField>
    </View>
    <View>
    <Pressable onPress={showDatepicker}>
        <Text style={[mystyle.coloredText, mystyle.centered, mystyle.smText, {marginTop: 30}]}>{editor? <Text>Change </Text> : <Text>Select </Text>}Expiry Date</Text>
    </Pressable>
    {show && (
					<DateTimePicker
						style={[mystyle.centered, { marginTop: 15, minWidth: 120 }]}
						testID='dateTimePicker'
						value={datepick}
						is24Hour={true}
						minimumDate={new Date()}
						display='default'
						onChange={onChange}
					/>
				)}
    {editor?
    <View>
      {inputsArray[4] === 'Fresh' || inputsArray[4] === 'Frozen'?
      <>
        <DotList handleUpdate={handleUpdate} titleArr={inputsArray}  groupArr={ripeness} arrIndex={5} placeHold='Ripeness'></DotList></>
        : <DotList handleUpdate={handleUpdate}  titleArr={inputsArray}  groupArr={confectionsWOFresh} arrIndex={4} placeHold='Confection'></DotList>}
        <TouchableOpacity style={[mystyle.myMainBtn, mystyle.centered, {marginTop: 20}]} 
    onPress={() => onDataReady(inputsArray[0], inputsArray[1], inputsArray[2], inputsArray[3], inputsArray[4], inputsArray[5], datepick)}>
      <MyButton btnColor='tint' btnText='Edit' ></MyButton>
    </TouchableOpacity> 
    </View>
    :  <>
    
    <DotList handleUpdate={handleUpdate}  titleArr={inputsArray}  groupArr={confectionsWFresh} arrIndex={4} placeHold='Confection'></DotList>
         {inputsArray[4] === 'Fresh'?
         <DotList handleUpdate={handleUpdate}  titleArr={inputsArray} groupArr={ripeness} arrIndex={5} placeHold='Ripeness'></DotList> : <View></View>}
         <><TouchableOpacity style={[mystyle.myMainBtn, mystyle.centered, {marginTop: 20}]}  
        onPress={() => onDataReady(inputsArray[0], inputsArray[1], inputsArray[2], inputsArray[3], inputsArray[4], inputsArray[5], datepick)}>
          <MyButton btnColor='tint' btnText='Add'></MyButton>
        </TouchableOpacity>
        <TouchableOpacity style={[mystyle.myMainBtn, mystyle.centered, {borderRadius: 15, borderColor: Colors.light.tint, borderWidth: 1}]} onPress={()=>setScanner(true)}>
          <MyButton btnColor='light' btnText='Scan Bar Code'></MyButton>
        </TouchableOpacity>
    {scanner?
    <MyScanner handleClosing={() => setScanner(false)} handleScanning={handleCodeScanned}></MyScanner> : <View></View>}
    </>
    </>}
    </View>
</View>
)}
export default Form;