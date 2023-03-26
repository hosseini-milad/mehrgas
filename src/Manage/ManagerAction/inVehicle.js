import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import {Input,FormControl,InputLabel} from '@material-ui/core';
import ProfileStockItem from '../../ProfilePage/ProfileStockItem';
import env from '../../env';
import { useEffect } from 'react';
import SimpleAlert from "../../Components/SimpleAlert";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function InVehicleHeader(props){
    const [orderDetail,setOrderDetail]= useState('')
    const [carNo,setCarNo]= useState('')
    const [alertShow,setAlertShow] = useState({show:false,action:0})

    const [orderValue,setOrderValue]= useState('')
    //console.log(orderDetail)
    useEffect(()=>{
      if(orderValue.length<5){
        setOrderDetail()
        return
      }
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({status:"inVehicle",
                search:orderValue,
                userId:(token.access==="customer"||!token.access)?token.userId:''})
          }
          
            fetch(env.siteApi+"/order/stockSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                if(result&&result.length===1)
                setOrderDetail(result[0])
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
    },[orderValue])
    useEffect(()=>{
      if(!alertShow.action)return;
      const postOptions={
          method:'post',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token':token&&token.token,
            'userId':token&&token.userId},
            body:JSON.stringify({stockOrderNo:orderDetail.stockOrderNo,
              carNo:carNo,description:"test",
              status:"saleControl"})
      }
      console.log(postOptions)
      fetch(env.siteApi+"/order/manage/addstock",postOptions)
      .then(res => res.json())
      .then(
          (result) => {
          console.log(result);
          setOrderValue('')
          setCarNo('')
          setTimeout(()=>props.setRefreshRate(1),200)
          },
          (error) => {
          console.log(error);
          }
      )
      .catch((error)=>{
          console.log(error)
      })
    },[alertShow])
    return(
        <>
        <div className='secButton'>
            <div className='carNo'>
                <TextField label="شماره سفارش" //variant="outlined" 
                onChange={(e)=>setOrderValue(e.target.value)}/>
                <br/>
                <br/>
                <FormControl variant="standard">
                <InputLabel htmlFor="formatted-text-mask-input">شماره ماشین</InputLabel>
                    <Input
                    value={carNo}
                    onChange={(e)=>setCarNo(e.target.value)}//setCarNo}
                    name="textmask"
                    id="formatted-text-mask-input"
                    inputComponent={maskCarNo}
                    />
                </FormControl>
                
            {carNo?<button onClick={()=>setAlertShow(pState => {
                    return { ...pState, show: true,title:"تایید سفارش",text:"آیا از تایید سفارش و تایید موجودی اطمینان دارید؟" ,
                    part:"",status:"saleControl",reason:"",carNo:carNo}
                    })} className='editOrderButton acceptBtn'>تایید</button>
            :<button className="disableBtn editOrderButton">تایید</button>}
            </div>
            <div className='orderDesc'>
            {orderDetail?<ProfileStockItem open={1} orderData={orderDetail} manager={"manager"} 
              userInfo={orderDetail.userId} />:<></>}
            </div>
        </div>
        {alertShow.show?<SimpleAlert data={{text:"سفارش با موفقیت ثبت شد"}}
           setAlertShow={setAlertShow} nocancel={1}/>:<></>}
        </>
    )
}
export default InVehicleHeader

const maskCarNo = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00 [a] 000"
        /*definitions={{
          '#': /[1-9]/,
        }}*/
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  });