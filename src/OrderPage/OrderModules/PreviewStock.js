import { useEffect, useState } from "react";
import env, { normalPrice } from "../../env";
import ImagePop from "../Stock/Stock01/ImagePop";

function PreviewStock(props){
    const [stockDetail,setStockDetail] = useState([])
    const defData = props.defData;

    const lensRows = defData.stockFaktor;
    console.log(lensRows)
    /*useEffect(() => { 
        if(lensRows){
        for(var i=0;i<lensRows.length;i++){
        //const data = orderData&&orderData.rxLenz?orderData.rxLenz.split(','):[];
        var postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({sku:lensRows[i].sku})
          }
          fetch(env.siteApi+"/order/stock/find",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result,data)
                setStockDetail(existingItems => {
                    return [
                    ...existingItems.slice(0, i),
                    result[0],
                    ...existingItems.slice(i + 1),
                    ]
                })

                //setStockDetail(result)
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
        }  }
    },[lensRows])*/
    return(
        <div className="orderDataHolder">
            <table className="orderTable stockTable rtl">
                <tbody>
                    <tr>
                        <th style={{width:"20px"}}>ردیف</th>
                        {/*<th style={{width:"35px"}}>کد</th>*/}
                        <th>برند</th>
                        <th style={{width:"35px"}}>تعداد</th>
                        <th>قیمت واحد</th>
                        <th>قیمت کل</th>
                    </tr>
                    {lensRows&&lensRows.map((faktorItem,i)=>(
                    <tr key={i}>
                        <td>{i+1}</td>
                        {/*<td >{faktorItem.sku}</td>*/}
                        
                        <td dangerouslySetInnerHTML={{__html:"<strong>"+
                            faktorItem.stockDetail.brandName+"</strong>"+"-"+
                            faktorItem.stockDetail.lenzIndex+"<br/>"+
                            ""+faktorItem.stockDetail.material+"-"+
                            (faktorItem.stockDetail.coating&&
                            faktorItem.stockDetail.coating)}}></td>
                        <td>{faktorItem.count}</td>
                        <td style={{direction: "ltr"}} >{normalPrice(faktorItem.price)}</td>
                        <td style={{direction: "ltr"}}>
                           {normalPrice(faktorItem.price*faktorItem.count)}</td>
                        
                    </tr>))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>قیمت کل</td>
                        <td style={{fontSize:"15px",fontWeight:"bold"}}>{normalPrice(defData.stockOrderPrice)} ریال</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    )
}
export default PreviewStock