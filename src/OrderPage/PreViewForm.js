import { useEffect, useState } from "react";
import ButtonLoader from "../Components/BtnLoader";
import env, { discountPercent, normalPrice, purePrice, sumPrice } from "../env";
import Preview from "./OrderModules/Preview";

function PreViewForm(props){
    const defData = props.def;
    const rawPrice=defData.rxLenz?defData.rxLenz.split(','):[0,0];
    const [serPrice,serPriceSet] = useState(0)
    const [price,setPrice] = useState(["0","0"]);
    const [lenzDetail,setLenzDetail] = useState()
    const [color,setColor] = useState()
    const [moreService,setMoreService] = useState(0);
    const [offers,setOffers] = useState('')
    //console.log(defData)
    useEffect(() => {
        const data = rawPrice.length?rawPrice[2]:'';
        
        if(!data)return
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({sku:data})
          }
          fetch(env.siteApi+"/order/manufacture/find",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setLenzDetail(result)
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

            serPriceSet(sumPrice(defData.mirrorPrice+"+"+defData.coverPrice+"+"+defData.NazokTighPrice+"+"+
            defData.colorPrice+"+"+defData.expressPrice))

        },[])   
    useEffect(() => {   
            if(!lenzDetail)return 

            const postOffers={
                method:'post',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({userId:defData.userId,
                    brandName:lenzDetail.brandName})
              }
            fetch(env.siteApi+"/product/list/offers",postOffers)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result)
                if(result.offers&&result.offers.length){
                    setOffers(result);
                    setPrice([purePrice(sumPrice(rawPrice[0]*
                        (defData.odMain===",,,,"||defData.osMain===",,,,"?1:2)
                        +"+"+serPrice))*
                        (100-parseFloat(result.offers[0].discountPercent))/100,
                    purePrice(sumPrice(rawPrice[0]*
                        (defData.odMain===",,,,"||defData.osMain===",,,,"?1:2)
                        +"+"+serPrice))*
                        parseFloat(result.offers[0].discountPercent)/100])
                    
                }
                else{
                    setPrice([rawPrice[0],0])
                }
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
    },[lenzDetail])
    
    return(
        <div className="orderStepsHolder">
            <div className="orderDataHolder"><br/>
            <div className='innerSeprator'>
              <div className='innerHeader innerPreview'>مشخصات سفارش</div>
              <Preview lenzDetail={lenzDetail} defData={defData}  colorList={color}/>
            </div>
            
            <div className='innerSeprator' style={{padding:"3rem 0"}}>
              <div className='innerHeader'>خدمات</div>
            <div className="orderDataHolder">
                
                <table className="orderTable rtl">
                    <tbody className="mobileTbody">
                        <tr>
                            <th>خدمت</th>
                            <th>هزینه</th>
                        </tr>
                        
                        {defData.odMain===",,,,"||defData.osMain===",,,,"?<tr>
                            <td>قیمت تک عدسی</td>
                            <td>{normalPrice(rawPrice[0]?rawPrice[0]:0)} ریال</td>
                        </tr>:<tr>
                            <td>قیمت عدسی</td>
                            <td>{normalPrice(rawPrice[0]?rawPrice[0]*2:0)} ریال</td>
                        </tr>}
                        <tr>
                            
                            <td>هزینه خدمات <sub className="tableMoreView"
                                onClick={()=>setMoreService((moreService+1)%2)}>
                                مشاهده جزئیات خدمات</sub></td>
                            <td>{serPrice} ریال</td>
                        </tr>
                        <tr style={{display:moreService?"revert":"none"}}><td colSpan={2}>
                            <table style={{width: "80%",margin: "auto"}}><tbody>
                            {defData.coverCode&&<tr>
                                <td>پوشش ({defData.coverCode})</td>
                                <td>{normalPrice(defData.coverPrice)} ریال</td>
                            </tr>}
                            {defData.colorPrice&&<tr>
                                <td>رنگ ({defData.colorCode})</td>
                                <td>{normalPrice(defData.colorPrice)} ریال</td>
                            </tr>}
                            {defData.mirrorPrice&&<tr>
                                <td>Mirror ({defData.mirrorCode})</td>
                                <td>{normalPrice(defData.mirrorPrice)} ریال</td>
                            </tr>}
                            {defData.expressPrice&&<tr>
                                <td>ارسال فوری</td>
                                <td>{normalPrice(defData.expressPrice)} ریال</td>
                            </tr>}
                            {defData.NazokTighPrice&&<tr>
                                <td>{defData.NazokTigh}</td>
                                <td>{normalPrice(defData.NazokTighPrice)}
                             {defData.NazokTighPrice!=="0"?"ریال":''} </td>
                            </tr>}
                        </tbody></table></td></tr>
                        {/*<tr>
                            <td>تخفیف عدسی</td>
                            <td>{normalPrice(rawPrice[1]?rawPrice[1]:0)} ریال</td>
                            </tr>*/}
                        {offers&&offers.offers[0]&&<tr>
                            <td>تخفیف مشتری
                            <sub className="offerSub">  {offers.offers[0].discountPercent} 
                                        {/*offers.offers[0].brandName*/}</sub>
                            </td>
                            <td>
                                <div className="offerHolder">
                                    {normalPrice(price[1])} ریال 
                                </div>
                            </td>
                        </tr>}
                        <tr>
                            <td>قیمت نهایی محصول</td>
                            <td>{normalPrice(offers?price[0]:sumPrice(serPrice+"+"+
                            ((defData.odMain===",,,,"||defData.osMain===",,,,")?
                            price[0]:price[0]*2)))} ریال</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            
            <hr/>
                <div className="previewContinue">
                    <ButtonLoader className="orderBtn orderBtnPreview" action={()=>{}}
                    saveState={props.saveState} price={price[0]} 
                    discount={offers.offers&&offers.offers[0]&&offers.offers[0].discountPercent}
                    title={"ثبت درخواست"}/>
                    <input type="button" className="orderBtn orderBtnPreview orderEtc" value="ویرایش" 
                    onClick={()=>{props.setTabIndex(5);window.location.href="/order/rx#moreInfo"}}/>
                    <input type="button" className="orderBtn orderBtnPreview orderEtc" value="چاپ پیش نمایش" 
                    onClick={()=>window.open("/print/temp",'_blank')}/>
                    <input type="button" className="orderBtn orderBtnPreview orderdisable" value="لغو درخواست" 
                    onClick={()=>{props.saveState({status:"cancel"});
                        setTimeout(()=>window.location.href="/profile#orders",1500)
                    }}/>
                </div>
            </div>
        </div>
    )
}
export default PreViewForm