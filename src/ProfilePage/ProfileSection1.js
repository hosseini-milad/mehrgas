import ProfileOrderList from "./ProfileOrderList"
import SimpleAuth from "../Components/simpleAuth";
import env from "../env";
import { useEffect, useState } from "react";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function ProfileSection1(){
    const [rxList,setRXList]= useState('');
    const [stockList,setStockList]= useState('');
    const [rxIndex,setIndex] = useState(0)
    const [refreshRate,setRefreshRate] = useState(1)
  
    useEffect(()=>{
      if(refreshRate){
        const postOptions={
            method:'get',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
              'userId':token.userId}
          }
          fetch(env.siteApi+"/order/rxSeprateCustomer",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setRXList(result);
                //setStockList(result.stockData)
                setRefreshRate(0)
                
                window.scrollTo(0, 470)
              },
              (error) => {
                setRXList({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
          fetch(env.siteApi+"/order/stockSeprateCustomer",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                console.log(result)
                setStockList(result);
                //setStockList(result.stockData)
                setRefreshRate(0)
              },
              (error) => {
                setStockList({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
          }
    },[refreshRate])

    useEffect(()=>{
      if(rxIndex>-1)window.scrollTo(0, 470)
  },[rxIndex])
    /*const rxStatus = [rxList&&rxList.filter(order=>order.status==="inprogress"),
    rxList&&rxList.filter(order=>order.status==="accept"),
    rxList&&rxList.filter(order=>order.status==="inproduction"),
    rxList&&rxList.filter(order=>order.status==="faktor"),
    rxList&&rxList.filter(order=>order.status==="sending"),
    rxList&&rxList.filter(order=>order.status==="delivered"),
    rxList&&rxList.filter(order=>order.status==="storeSent"),
    rxList&&rxList.filter(order=>order.status==="completed"),
    rxList&&rxList.filter(order=>order.status==="completed"),
    rxList&&rxList.filter(order=>order.status.includes("cancel"))
    ]
    const stockStatus = [stockList&&stockList.filter(order=>order.status==="inprogress"),
    stockList&&stockList.filter(order=>order.status==="accepted"),
    stockList&&stockList.filter(order=>order.status==="inproduction"),
    stockList&&stockList.filter(order=>order.status==="faktor"),
    stockList&&stockList.filter(order=>order.status==="sending"),
    stockList&&stockList.filter(order=>order.status==="delivered"),
    stockList&&stockList.filter(order=>order.status==="sentStore"),
    stockList&&stockList.filter(order=>order.status==="completed"),
    stockList&&stockList.filter(order=>order.status==="completed"),
    stockList&&stockList.filter(order=>order.status.includes("cancel"))
    ]*/
    const orderOptions = [
      {title:"سفارشات ثبت شده",status:"inprogress",count:rxList.rxDataInprogress,
        sCount:stockList.stockDataInprogress,access:"manager"},
      {title:"سفارشات تایید شده",status:"inVehicle",count:rxList.rxDataAccepted,
        sCount:stockList.stockDataAccepted,access:"control"},
      /*{title:"ورود خودرو",status:"inVehicle",count:rxList.rxDataInVehicle,
        sCount:stockList.stockDataInVehicle,access:"security"},
      {title:"کنترل فروش",status:"saleControl",count:rxList.rxDataSaleControl,
        sCount:stockList.stockDataSaleControl,access:"control"},
      {title:"خروج خودرو",status:"outVehicle",count:rxList.rxDataOutVehicle,
      sCount:stockList.stockDataOutVehicle,access:"security"},*/
      {title:"سفارشات نهایی",status:"completed",count:rxList.rxDataCompleted,
        sCount:stockList.stockDataCompleted,access:"manager"},
      {title:"سفارشات کنسل شده",status:"cancel",count:rxList.rxDataCancel,
        sCount:stockList.stockDataCancel,access:"factory"},
  ]
    //console.log(rxList)
    return(
        <><div className="profileHolder">
            {orderOptions.map((order,i)=>(
                <div className={i===rxIndex?"profileItemActive profileItem":"profileItem"} key={i}
                  style={{backgroundColor:i===3?"coral":i===2?"lightGreen":"",
                    width:i===6?"44%":i===5?"44%":""}} 
                    onClick={()=>setIndex(i)}>
                    <div className="profileText">
                        <strong>{order.title}</strong>
                        <sub>{order.sCount?("سفارش: "+order.sCount):' '}  
                        </sub>
                    </div>
                </div>
            ))}
        </div>
        <div className="profileOrderHolder">
            <ProfileOrderList setRefreshRate={setRefreshRate} status={orderOptions[rxIndex].status} setIndex={setIndex}
              rxIndex={rxIndex} manager="customer"  title={orderOptions[rxIndex].title} count={orderOptions[rxIndex].count}/>
        </div>
        </>
    )
}
export default ProfileSection1