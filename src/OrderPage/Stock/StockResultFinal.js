import { useEffect, useState } from "react";
import Paging from "../../CategoryPage/Paging";
import env, { normalPrice } from "../../env";
const perPage = 10;
const wWidth= window.innerWidth;
const token = JSON.parse(localStorage.getItem('token-lenz'));
function StockResult(props){
    const price=props.priceFilter?props.price:0;
    const content = props.content
    //console.log(props.count)
    const saveCart=(sku)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify(sku)
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/addCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                props.setOrderCount(result)
                setTimeout(()=>window.location.reload(),200)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    }
    
    //console.log(props)
    useEffect(() => {
        const postOptions={
            method:'get',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId}
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/getCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                props.setOrderCount(result.length)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    },[props.orderCount])
    return(
        <div className="orderDataHolder StockDataHolder">
            {content.size&&content.size===1?
                <div className="stockResultItems"><div>
                    <strong>{content.stock[0].brandName}</strong>
                    <span>{normalPrice(content.stock[0].price)}</span>
                </div>
                  <input className="orderBtn stockAdd" id="Add"
                    onClick={()=>{
                        saveCart({sku:content.stock[0].sku,
                          
                          count:props.count[0]})
                      
                    }}
                    value="افزودن" type="button"/>
                </div>:<></>}
        </div>
    )
}
export default StockResult