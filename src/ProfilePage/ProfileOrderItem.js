
import { useEffect, useState } from 'react';
import env from '../env';
import DateDef from './ProfileModules/DateDef';
import OrderHeader from '../Manage/ManageModules/OrderHeader'
import Kharid from '../Manage/ManagerAction/Kharid';
import Preview from '../OrderPage/OrderModules/Preview';
import ImagePop from '../OrderPage/Stock/Stock01/ImagePop';
function ProfileOrderItem(props){
    const orderData = props.orderData;
    const [brandData,setBrandData] = useState('')
    const [userInfo , setUserInfo] = useState({})
    const [showDetail,setShowDetail] = useState(props.open);
    const [color , setColor] = useState('')
    
    useEffect(() => {
        const data = orderData&&orderData.rxLenz?orderData.rxLenz.split(','):[];
        var postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({sku:data[2]})
          }
          fetch(env.siteApi+"/order/manufacture/find",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result,data)
                setBrandData(result)
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
            
            postOptions={
                method:'post',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({userId:orderData.userId})
            }
            fetch(env.siteApi+"/userInfo",postOptions)
              .then(res => res.json())
              .then(
                (result) => {
                  //console.log(result)
                  setUserInfo(result)
                },
                (error) => {
                  console.log({error:error});
                }
              )
              .catch((error)=>{
                console.log(error)
              })
              fetch(env.siteApi+"/order/color")
            .then(res => res.json())
            .then(
            (result) => {
                //console.log(result)
                setColor(result)
            },
            (error) => {
                console.log(error);
            }
            )
            .catch((error)=>{
            console.log(error)
            })
    },[])
    const rowHeader=["","SPH","CYL","AXIS","ADD","IPD","DEC",
    "Prism","جهت پریزم","PD"]
    const rows=[["R"].concat(orderData.odMain&&orderData.odMain.split(','))
                     .concat(orderData.odMore&&orderData.odMore.split(',')),
                ["L"].concat(orderData.osMain&&orderData.osMain.split(','))
                .concat(orderData.osMore&&orderData.osMore.split(','))];
    const userHeader=["کاربر","تولید کننده","برند","نوع عدسی","طراحی","ضریب شکست","پوشش","کریدور"];
    //console.log(orderData)
    var userRow=[orderData.consumer];
    userRow=brandData&&[orderData.consumer,brandData.facoryName,brandData.brandName,
        brandData.lenzType,brandData.lenzDesign,brandData.lenzIndex,brandData.material,
        brandData.coridor
    ]
    
    
    //console.log(alertShow)
    if(orderData.status.includes("cancel")&&
        (props.manager!=="manager"&&props.manager!=="sale"&&props.manager!=="customer"&&
        props.manager!==orderData.status.split('|')[2]))
        return
    return(
        <>{orderData&&orderData.status==="sending"?
            <div className="orderStepsHolder" style={{width: "70%",
              margin: "auto"}}>
              <OrderHeader manager={props.manager} orderData={orderData} setRefreshRate={props.setRefreshRate}
                 userInfo={userInfo}  setShowDetail={setShowDetail} showDetail={showDetail}/>
            </div>:

          <div className="profileOrderList">
            <div className="profileOrder">
                <OrderHeader manager={props.manager} orderData={orderData} setRefreshRate={props.setRefreshRate}
                 userInfo={userInfo}  setShowDetail={setShowDetail} showDetail={showDetail} cancel={props.cancel}/>
                
                <div style={{display:showDetail?"block":"none"}}>
                  <Preview lenzDetail={brandData} defData={orderData} colorList={color}/>
            <br/>
              </div>
            </div>
        </div>
        } 
        </>
    )
}
export default ProfileOrderItem