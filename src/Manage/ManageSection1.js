import env from "../env";
import { useEffect, useState } from "react";
import ProfileOrderList from "../ProfilePage/ProfileOrderList";
import Kharid from "./ManagerAction/Kharid";
import Shop from "./ManagerAction/Shop";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function ManageSection1(){
    const [rxList,setRXList]= useState('');
    const [rxIndex,setIndex] = useState(-1)
    const [stockList,setStockList]= useState('');
    const [manager,setManager] = useState('')
    const [refreshRate,setRefreshRate] = useState(1)
    
    useEffect(()=>{
      if(refreshRate){
        setRXList('');
        const postOptions={
            method:'get',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId}
          }
          fetch(env.siteApi+"/order/stockSeprate",postOptions)
          .then(res => res.json())
          .then(
            (result) => {
              //console.log(result);
              setStockList(result);
              //setStockList(result.stockData);
            },
            (error) => {
              window.location.href="/login";
              console.log({error:error});
            }
          )
          .catch((error)=>{
            console.log(error)
          })
        
          //console.log(postOptions)
          fetch(env.siteApi+"/order/rxSeprate",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result);
                setManager(result.userInfo)
                setRXList(result);
                //setStockList(result.stockData);
                setRefreshRate(0);
              },
              (error) => {
                window.location.href="/login";
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
          }
    },[refreshRate])
    useEffect(()=>{
      if(rxIndex>-1)window.scrollTo(0, 670)
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
    rxList&&rxList.filter(order=>order.status&&order.status.includes("cancel")),
    rxList&&rxList.filter(order=>order.status==="hold")
    ]*/
    //console.log(rxStatus)
    /*const stockStatus = [stockList&&stockList.filter(order=>order.status==="inprogress"),
    stockList&&stockList.filter(order=>order.status==="accepted"),
    stockList&&stockList.filter(order=>order.status==="inproduction"),
    stockList&&stockList.filter(order=>order.status==="faktor"),
    stockList&&stockList.filter(order=>order.status==="sending"),
    stockList&&stockList.filter(order=>order.status==="delivered"),
    stockList&&stockList.filter(order=>order.status==="storeSent"),
    stockList&&stockList.filter(order=>order.status==="completed"),
    stockList&&stockList.filter(order=>order.status==="completed"),
    stockList&&stockList.filter(order=>order.status.includes("cancel")),
    stockList&&stockList.filter(order=>order.status==="hold")
    ]*/
    const orderOptions = [
        {title:"سفارشات ثبت شده",status:"inprogress",count:rxList.rxDataInprogress,
          sCount:stockList.stockDataInprogress,access:"manager"},
        {title:"سفارشات تایید شده",status:"accept",count:rxList.rxDataAccepted,
          sCount:stockList.stockDataAccepted,access:"factory"},
        {title:"در حال تولید",status:"inproduction",count:rxList.rxDataInproduction,
          sCount:stockList.stockDataInproduction,access:"factory"},
        {title:"سفارشات تولید شده",status:"faktor",count:rxList.rxDataFaktor,
          sCount:stockList.stockDataFaktor,access:"factory"},
        {title:"در حال ارسال از کارخانه",status:"sending",count:rxList.rxDataSending,
        sCount:stockList.stockDataSending,access:"store&factory"},
        {title:"تحویل شده به انبار",status:"delivered",count:rxList.rxDataDelivered,
          sCount:stockList.stockDataDelivered,access:"store"},
        {title:"ارسال شده به فروشگاه",status:"storeSent",count:rxList.rxDataStoreSent,
          sCount:stockList.stockDataStoreSent,access:"store&shop"},
        {title:"ارسال به مشتری",status:"completed",count:rxList.rxDataCompleted,
          sCount:stockList.stockDataCompleted,access:"shop"},
        {title:"سفارشات نهایی",status:"completed",count:rxList.rxDataCompleted,
          sCount:stockList.stockDataCompleted,access:"manager"},
        {title:"سفارشات کنسل شده",status:"cancel",count:rxList.rxDataCancel,
          sCount:stockList.stockDataCancel,access:"factory"},
    ]
    //console.log(rxStatus)
    //console.log(rxList)
    return(
        <><div className="profileHolder">
            {orderOptions.map((order,i)=>(
              (order.access.includes(token.access)||token.access==="manager"||token.access==="sale")&&
                <div className={i===rxIndex?"profileItemActive profileItem":"profileItem"} key={i}
                    style={{backgroundColor:i===9?"coral":i===8?"lightGreen":"",
                            width:i===9?"44%":i===8?"44%":""}} 
                    onClick={()=>setIndex(i)}>
                    <div className="profileText">
                        <strong>{order.title}</strong>
                        <sub>{order.count} RX</sub>
                        <sub>{order.sCount?("Stock: "+order.sCount):' '}</sub>
                    </div>
                </div>
            ))}
        </div>
        <div className="profileOrderHolder">
            {rxIndex!==-1?(rxIndex===4&&token.access==="store")?
            <div className="orderStepsHolder" style={{width: "70%",
            margin: "auto"}}>
              <Kharid status={orderOptions[rxIndex].status}/></div>:
              (rxIndex===6&&token.access==="shop")?
              <div className="orderStepsHolder" style={{width: "70%",
              margin: "auto"}}>
                <Shop status={orderOptions[rxIndex].status}/></div>:
              <ProfileOrderList setRefreshRate={setRefreshRate} refreshRate={refreshRate}
                  title={orderOptions[rxIndex].title} manager={manager}
                  count={orderOptions[rxIndex].count} sCount={orderOptions[rxIndex].sCount}
                  rxIndex={rxIndex} status={orderOptions[rxIndex].status} setIndex={setIndex}/>:
                ''}
        </div> 
        {/*<input type="text" placeholder="جستجوی جدید" onChange={(e)=>
        setRXList(rxList.filter(item=>item.rxOrderNo.includes(e.target.value)))}/>*/}
        </>
    )
}
export default ManageSection1