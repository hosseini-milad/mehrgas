import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import {Input,FormControl,InputLabel,MenuItem} from '@material-ui/core';
import ProfileStockItem from '../../ProfilePage/ProfileStockItem';
import env, { pelakOpt } from '../../env';
import { useEffect } from 'react';
import SimpleAlert from "../../Components/SimpleAlert";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function InVehicleHeader(props){
    const [orderDetail,setOrderDetail]= useState('')
    const [carNo,setCarNo]= useState('')
    const [alertShow,setAlertShow] = useState({show:false,action:0})
    const [pelak,setPelak] = useState({left:'',mid:'',right:'',iran:''})
    const [description,setDescription] = useState('')
    const [orderValue,setOrderValue]= useState('')
    const [todayOrders,setTodayOrders]= useState('')
    const [pelakOptions,setPelakOptions] = useState([]) 
    //console.log(pelak.left+" "+pelak.mid+" "+pelak.right)
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({page:0,userId:token.userId})
          }
          
            fetch(env.siteApi+"/order/todayOrder",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setTodayOrders(result)
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
            setPelakOptions(pelakOpt())
    },[])
    const updateIndex=(value,index)=>{
      const nextfield = document.querySelector(
          (index===0&&value.length>1)?"#pelakM":
          index===1?"#pelakR":"#pelak"
        );
        // If found, focus the next field
        if (nextfield !== null) {
          nextfield.focus();
        }
  }
  console.log(orderDetail&&orderDetail.userId)
    useEffect(()=>{
      if(orderValue.length<5){
        setOrderDetail()
        return
      }
      setOrderDetail()
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({status:"inVehicle",
                search:orderValue,
                group:token.group,
                userId:(token.access==="customer"||!token.access)?token.userId:''})
          }
          
            fetch(env.siteApi+"/order/stockSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result)
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
            body:JSON.stringify({stockOrderNo:orderValue,//orderDetail.stockOrderNo,
              carNo:pelak.left+"-"+pelak.right+"-"+pelak.iran+"&"+
              pelak.mid,description:
              orderDetail.description+"نگهبانی: "+description+"<br/>",
              status:"saleControl"})
      }
      //console.log(postOptions)
      fetch(env.siteApi+"/order/manage/addstock",postOptions)
      .then(res => res.json())
      .then(
          (result) => {
          console.log(result);
          setOrderValue('')
          //setCarNo('')
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
                <TextField label="شماره سفارش" value={orderValue} 
                onChange={(e)=>setOrderValue(e.target.value)}/>
                <br/>
                <br/>
                {/*<FormControl variant="standard">
                <InputLabel htmlFor="formatted-text-mask-input">شماره ماشین</InputLabel>
                    <Input
                    value={carNo}
                    onChange={(e)=>setCarNo(e.target.value)}//setCarNo}
                    name="textmask"
                    id="formatted-text-mask-input"
                    inputComponent={maskCarNo}
                    />
    </FormControl>*/}
                  <div className='pelak'>
                  <TextField value={pelak.left} id="pelakL"
                    onChange={(e)=>{setPelak(pelak => ({
                      ...pelak,
                      ...{left:e.target.value}
                    }));
                    updateIndex(e.target.value,0)}}/>
                  <TextField value={pelak.mid}  id="pelakM"
                    select
                    defaultValue={"ع"}
                    onChange={(e)=>{setPelak(pelak => ({
                      ...pelak,
                      ...{mid:e.target.value}
                    }));
                    updateIndex(e.target.value,1)}}>
                        {pelakOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField value={pelak.right}  id="pelakR"
                    onChange={(e)=>{setPelak(pelak => ({
                      ...pelak,
                      ...{right:e.target.value}
                    }));
                    updateIndex(e.target.value,2)
                    }}/>
                    <TextField value={pelak.iran}  id="pelakI"
                    onChange={(e)=>{setPelak(pelak => ({
                      ...pelak,
                      ...{iran:e.target.value}
                    }));
                    updateIndex(e.target.value,3)
                    }} label="ایران"/>
                  </div>
                <br/><br/>
                <textarea className='textAreaOrder' value={description} rows="3"
                    onChange={(e)=>setDescription(e.target.value)}></textarea>
                
            {pelak.left?<button onClick={()=>setAlertShow(pState => {
                    return { ...pState, show: true,title:"تایید سفارش",text:"آیا از تایید سفارش و تایید موجودی اطمینان دارید؟" ,
                    part:"",status:"saleControl",reason:"",carNo:pelak}
                    })} className='editOrderButton acceptBtn'>تایید</button>
            :<button className="disableBtn editOrderButton">تایید</button>}
            </div>
            <div className='orderDesc'>
            {orderDetail?<ProfileStockItem open={1} orderData={orderDetail} manager={"manager"} 
              userInfo={orderDetail.userId} />:<></>}
            </div>
        </div>
        {/*<table className='todayOrder'>
          <tbody>
            <tr>
              <th>شماره سفارش</th>
              <th>انتخاب</th>
            </tr>
            {todayOrders&&todayOrders.map((order,i)=>(
              <tr key={i}>
                <td>{order.stockOrderNo}</td>
                <td><button onClick={()=>setOrderValue(order.stockOrderNo)}>انتخاب</button></td>
              </tr>
            ))}
          </tbody>
            </table>*/}
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