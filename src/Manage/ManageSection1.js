import env from "../env";
import { useEffect, useState } from "react";
import ProfileOrderList from "../ProfilePage/ProfileOrderList";
import Kharid from "./ManagerAction/Kharid";
import Shop from "./ManagerAction/Shop";
import InVehicleHeader from "./ManagerAction/inVehicle";
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
    const orderOptions = [
        {title:"سفارشات ثبت شده",status:"inprogress",count:rxList.rxDataInprogress,
          sCount:stockList.stockDataInprogress,access:"manager"},
        {title:"سفارشات تایید شده",status:"accept",count:rxList.rxDataAccepted,
          sCount:stockList.stockDataAccepted,access:"control"},
        {title:"ورود خودرو",status:"inVehicle",count:rxList.rxDataInVehicle,
          sCount:stockList.stockDataInVehicle,access:"security"},
        {title:"کنترل فروش",status:"saleControl",count:rxList.rxDataSaleControl,
          sCount:stockList.stockDataSaleControl,access:"control"},
        {title:"خروج خودرو",status:"outVehicle",count:rxList.rxDataOutVehicle,
        sCount:stockList.stockDataOutVehicle,access:"security"},
        {title:"سفارشات نهایی",status:"completed",count:rxList.rxDataCompleted,
          sCount:stockList.stockDataCompleted,access:"manager"},
        {title:"سفارشات کنسل شده",status:"cancel",count:rxList.rxDataCancel,
          sCount:stockList.stockDataCancel,access:"factory"},
    ]
    //console.log(rxStatus)
    //console.log(stockList)
    return(
        <><div className="profileHolder">
            {orderOptions.map((order,i)=>(
              (order.access.includes(token.access)||token.access==="manager")&&
                <div className={i===rxIndex?"profileItemActive profileItem":"profileItem"} key={i}
                    style={{backgroundColor:i===6?"coral":i===5?"lightGreen":"",
                            width:i===6?"46%":i===5?"46%":""}} 
                    onClick={()=>setIndex(i)}>
                    <div className="profileText">
                        <strong>{order.title}</strong>
                        <sub>{order.sCount?("سفارش: "+order.sCount):' '}</sub>
                    </div>
                </div>
            ))}
        </div>
        <div className="profileOrderHolder">
            {rxIndex!==-1?
            ((rxIndex===2)&&token.access==="security")?
              <div className="orderStepsHolder" style={{width: "70%",
                margin: "auto"}}>
              <InVehicleHeader status={orderOptions[rxIndex].status}
              setRefreshRate={setRefreshRate} refreshRate={refreshRate}/></div>:
            
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