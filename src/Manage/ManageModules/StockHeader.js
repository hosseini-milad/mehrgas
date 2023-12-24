import persianDate from 'persian-date';
import { useEffect, useState } from 'react';
import Alert from '../../Components/Alert';
import env from '../../env';
import DateDef from '../../ProfilePage/ProfileModules/DateDef'
import OrderStatusMessage from '../../ProfilePage/ProfileModules/OrderStatusMessage';
import ManageStockHeader from '../ManagerAction/ManageStockHeader';
import StoreHeader from '../ManagerAction/StoreHeader';
import ShopHeader from '../ManagerAction/ShopHeader';
import ControlStockHeader from '../ManagerAction/ControlStockHeader';
import SimpleStockHeader from '../ManagerAction/SimpleStockHeader';

function StockHeader(props){
    const orderData = props.orderData;
    //console.log(orderData)
    persianDate.toCalendar('persian');
    const pDate = new persianDate(new Date(orderData.date)).format();
    const oDate = orderData.loadDate?
        new persianDate(new Date(orderData.loadDate)).format():'';
    const pWeek = new persianDate(new Date(orderData.date)).format('dddd');
    const oWeek = orderData.loadDate?
        new persianDate(new Date(orderData.loadDate)).format('dddd'):'';
    
    const countDown = (new Date(orderData.date))-(new Date());
    //console.log(orderData)
    const [alertShow,setAlertShow] = useState(
        {show:false,action:0})

    //console.log(alertShow)
    const changeOrderStatus=(status,reason,description,data)=>{
        //const acceptStatus = !reason&&window.confirm("تایید سفارش؟");
        const token = JSON.parse(localStorage.getItem('token-lenz'))
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token&&token.token,
              'userId':token&&token.userId},
              body:JSON.stringify({stockOrderNo:orderData.stockOrderNo,
                description:description,...data,
                status:reason?status+"|"+reason+"|"+props.manager:status})
        }
        console.log(postOptions)
        fetch(env.siteApi+"/order/manage/addstock",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            //console.log(result);
            status==="initial"?window.location.href="/order/stock":
            setTimeout(()=>props.setRefreshRate(1),200)
            },
            (error) => {
            console.log(error);
            }
        )
        .catch((error)=>{
            console.log(error)
        })
    }
    useEffect(() => {
        alertShow.action&&changeOrderStatus(
            alertShow.status,alertShow.reason,alertShow.description,alertShow.data)
    },[alertShow.action])
    console.log(props.manager)
    return(<>
        <div className="orderHeaderTitle">
            {props.manager==="customer"?
            <DateDef countDown={countDown} changeOrderStatus={changeOrderStatus}
            setAlertShow={setAlertShow} orderData={orderData} />:
            (props.manager==="manager"||props.manager==="sale")?
            (<ManageStockHeader orderData={orderData} 
                changeOrderStatus={changeOrderStatus} setAlertShow={setAlertShow}/>):
            
            props.manager==="control"?(<ControlStockHeader orderData={orderData} 
                changeOrderStatus={changeOrderStatus} setAlertShow={setAlertShow}/>):
            props.manager==="security"?(<SimpleStockHeader orderData={orderData} 
                status="completed"
                changeOrderStatus={changeOrderStatus} setAlertShow={setAlertShow}/>):''}
            {orderData.status.includes("cancel")&&
            <small style={{color:"red"}}>
                {orderData.status.split('|')[2]}<br/>{orderData.status.split('|')[1]}
            </small>}
            
            <OrderStatusMessage status={orderData.status} pWeek={pWeek} pDate={pDate.split(' ')[0].replaceAll('-','/')} 
                user={props.userInfo} rawDate={pDate.split(' ')[1]} oWeek={oWeek}
                orderDate={oDate?oDate.split(' ')[0].replaceAll('-','/'):''}/>
            <div style={{display:"grid"}}>
                <small>شماره سفارش: {orderData.stockOrderNo}</small>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                    <button className='profileBtn' onClick={()=>props.setShowDetail((props.showDetail+1)%2)}>
                    {props.showDetail?"بستن جزئیات":"مشاهده جزئیات"}</button>
                    {(orderData.status==="completed"||orderData.status==="outVehicle")?
                    <button className='profileBtn' onClick={()=>window.open("/print/"+orderData.stockOrderNo,'_blank')}>
                    {"چاپ سفارش"}</button>:<></>}</div>
            </div>
        </div>
        {alertShow.show?<Alert data={alertShow} setAlertShow={setAlertShow}/>:''}
        </>
    )
}
export default StockHeader