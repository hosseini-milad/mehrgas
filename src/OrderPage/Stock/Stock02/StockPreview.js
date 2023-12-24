import { useEffect } from "react";
import { useState } from "react";
import env, { normalPrice } from "../../../env";

function StockPreview(props){
    const lenzDetail = props.lenzDetail;
    const [stockDetail,setStockDetail] = useState([])
    
    const defData = props.defData;
    const lensRows = defData.stockFaktor;
    //console.log(lensRows)
    useEffect(() => { 
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
        }  
    },[])
    var pair = 0;
    return(
        <div className="orderDataHolder">
            <div className="tableHolder">
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
                    {lensRows&&stockDetail.length&&lensRows.map((faktorItem,i)=>(
                        
                    stockDetail[i]&&<tr key={i}>
                        <td>{i+1}</td>
                        {/*<td >{faktorItem.sku}</td>*/}
                        
                        <td dangerouslySetInnerHTML={{__html:"<strong>"+stockDetail[i].brandName+"</strong>"+"-"+
                            stockDetail[i].lenzIndex+"<br/>"+
                            ""+(stockDetail[i].material?stockDetail[i].material:'')+"-"+
                            (stockDetail[i].coating?stockDetail[i].coating:'')}}></td>
                        
                        <td>{faktorItem.count}</td>
                        <td style={{direction: "ltr"}}> {normalPrice(faktorItem.price)}</td>
                        <td style={{direction: "ltr"}} dangerouslySetInnerHTML={{__html:
                            normalPrice(faktorItem.price*faktorItem.count)}}></td>
                        
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
            
            <table className="orderTable" style={{marginTop:"8px"}}>
                <tbody>
                    <tr style={{height:"70px",textAlign:"right",padding:"10px"}}>
                        <td><span style={{textAlign:"right",direction:"rtl"}}
                        dangerouslySetInnerHTML={{__html:
                            defData&&defData.description?defData.description:"توضیحات"
                        }}/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default StockPreview