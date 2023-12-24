import { useState ,useEffect } from "react";
import persianDate from 'persian-date';
import env from "../../env";
import Preview from "./Preview";
import PreviewStock from "./PreviewStock";
var token = JSON.parse(localStorage.getItem('token-lenz'));

function PrintArea(props){
    const orderNo = document.location.pathname.split('/')[2];
    const [orderInfo, setOrderInfo] = useState('');
    const [rxInfo , setRxInfo] = useState('')
    const [pDate,setPDate] = useState('');
    const[pWeek,setPWeek] = useState('');
    const[color,setColor] = useState('');
    console.log(pWeek)
    useEffect(() => {
          const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json'},
            body:JSON.stringify({'stockOrderNo':orderNo})
          }
          fetch(env.siteApi+"/order/fetch-stock",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setOrderInfo(result);
                
                setPDate(new Date(result.date).toLocaleString('fa'));
                //setPWeek(new persianDate(new Date(result.date)).format().split(' ')[1].split(':'));
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
      
          //window.scrollTo(0, 170);
      },[])
      useEffect(() => {
        if(!orderInfo) return
        const data = orderInfo.rxLenz?orderInfo.rxLenz.split(',')[2]:'';
        
        if(!data)return
        const postOptions={
          method:'post',
          headers: { 
            'Content-Type': 'application/json'},
            body:JSON.stringify({sku:data})
        }
        fetch(env.siteApi+"/order/manufacture/find",postOptions)
          .then(res => res.json())
          .then(
            (result) => {
                setRxInfo(result)
            },
            (error) => {
              console.log({error:error});
            }
          )
          .catch((error)=>{
            console.log(error)
          })
        //window.scrollTo(0, 170);
    },[orderInfo])
    //console.log(rxInfo)
    const printNow=()=>{
        window.print();
    }
    return(
        <div className="printArea">
            <div className="userInfo">
              <div className="userSection">
                <strong>مهرگاز | تامین و توزیع گاز مایع</strong>
                <span>www.MehrGaz.com</span>
                <span>کد: 15</span>
              </div>
              <div className="userSection">
                <h1>Mehr Gaz</h1>
              </div>
              <div className="userSection">
                <small>تاریخ: <b>{pDate&&pDate.split(',')[0]}</b></small>
                <small>شماره سفارش: <b>{orderNo}</b></small>
                
                <small>ساعت ثبت سفارش: <b>{pDate&&pDate.split(',')[1]}</b></small>
              </div>
            </div>
            
              <PreviewStock defData={orderInfo} lenzDetail={rxInfo}/>
            <button onClick={()=>printNow()}>چاپ</button>
        </div>
    )
}
export default PrintArea