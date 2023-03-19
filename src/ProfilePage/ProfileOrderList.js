
import { useState } from "react";
import TextField from '@material-ui/core/TextField';
import ProfileOrderItem from "./ProfileOrderItem";
import ProfileStockItem from "./ProfileStockItem";
import { useEffect } from "react";
import env from "../env";
import Paging from "../CategoryPage/Paging";
const token = JSON.parse(localStorage.getItem('token-lenz'))
function ProfileOrderList(props){
    //const [rxList,setRXList] = useState(''); 
    const [searchText,setSearch]=useState(0) 
    const [searchTrigger,setSearchTrigger]=useState(0)
    const stockList = props.stockList;
    const [stockRX,setStockRX]= useState(0)
    const [searchList,setSearchList] = useState()
    const [searchStockList,setSearchStockList] = useState()
    const [pageNumber,setPageNumber] = useState('')
    
    useEffect(()=>{
      //if(!searchTrigger)return
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({status:searchText?'':props.status,
                search:searchText,offset:pageNumber,
                userId:(token.access==="customer"||!token.access)?token.userId:''})
          }
          fetch(env.siteApi+"/order/rxSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                if(searchText){
                    var index = 0;
                    if(result[0]&&result[0].status==="inprogress")index=0;
                    if(result[0]&&result[0].status==="accept")index=1;
                    if(result[0]&&result[0].status==="inproduction")index=2;
                    if(result[0]&&result[0].status==="faktor")index=3;
                    if(result[0]&&result[0].status==="sending")index=4;
                    if(result[0]&&result[0].status==="delivered")index=5;
                    if(result[0]&&result[0].status==="storeSent")index=6;
                    if(result[0]&&result[0].status==="completed")index=7;
                    if(result[0]&&result[0].status==="cancel")index=8;
                    props.setIndex(index);
                }
                setSearchList(result);
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
            fetch(env.siteApi+"/order/stockSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                if(searchText){
                    var index = 0;
                    if(result[0]&&result[0].status==="inprogress")index=0;
                    if(result[0]&&result[0].status==="accept")index=1;
                    if(result[0]&&result[0].status==="completed")index=7;
                    if(result[0]&&result[0].status==="cancel")index=8;
                    
                }
                setSearchStockList(result);
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
    },[props.status,props.refreshRate,searchText,pageNumber])
    const manager = token&&token.access;
    if(!token){
    localStorage.removeItem('token-lenz');
        window.location="/login";}
    useEffect(()=>{
        window.scrollTo(0, 470);
    },[pageNumber])
    return(
        <>
        <div className="headerOrderPlace">
            <h2 className="profileTitle">{props.title}</h2>
            <TextField label="جستجو" variant="outlined" 
                onChange={(e)=>{
                    setSearch(e.target.value)
                    setSearchTrigger(e.target.value.length>2?1:0)
                }
                }/>
        </div>
        <div className="rxStockTabHolder">
            {(token.access!=="factory")&&
            <div className={stockRX===1?"rxStockTab rxStockTabActive":"rxStockTab"} 
                onClick={()=>setStockRX(1)}>
                Stock
            </div>}
            <div className={stockRX===0?"rxStockTab rxStockTabActive":"rxStockTab"} 
                onClick={()=>setStockRX(0)}>
                RX
            </div>
            {(token.access==="manager"&&props.rxIndex===0)&&<div className={stockRX===2?"rxStockTab rxStockTabActive":"rxStockTab"} 
                onClick={()=>setStockRX(2)}>
                کنسل شده ها
                <b className="messageCounter">{props.cancelList&&props.cancelList.filter(item=>(item.status&&item.status.split('|')[2])&&
                    item.status.split('|')[2]==="factory").length}</b>
            </div>}
        </div>
        {searchList&&stockRX===0&&
        searchList.map((rx,i)=>(<div key={rx._id}>
            <ProfileOrderItem open={!i} orderData={rx} manager={manager} setRefreshRate={props.setRefreshRate}/>
        </div>
        ))}
        {searchStockList&&stockRX===1&&
        searchStockList.map((stock,i)=>(<div key={stock._id}>
           <ProfileStockItem open={!i} orderData={stock} manager={manager} setRefreshRate={props.setRefreshRate}/>
            
        </div>
        ))}
        {props.cancelList&&stockRX===2&&props.cancelList.map((rx,i)=>(rx.status.split('|')[2]==="factory"?
            <div key={rx._id}>
                <ProfileOrderItem open={!i} orderData={rx} manager={manager} setRefreshRate={props.setRefreshRate} cancel={1}/>
            </div>:<></>
        ))}
        {searchList?<Paging content={{size:stockRX===0?props.count:props.sCount}} setPageNumber={setPageNumber} pageNumber={pageNumber} perPage={10}/>:<></>}
        </>
    )
}
export default ProfileOrderList