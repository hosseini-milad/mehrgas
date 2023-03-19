import { useEffect, useState } from "react";
import ImagePop from "../Stock/Stock01/ImagePop";
import Barcode from 'react-barcode';
import env from "../../env";

function Preview(props){
    const lenzDetail = props.lenzDetail;
    const [iDisplay , setIDisplay] = useState(-1)
    const [coverContent , setCoverContent] = useState('')
    const defData = props.defData;
    const options=[" ","SPH","CYL","AXIS","ADD","DIA",
    "Base","Prism","جهت پریزم","DEC","","PD"];
    const frameOptions=["HBox","VBox","BVD","DBL","ED","PT","FH","Base"]
    
    useEffect(() => {
        try{setCoverContent(
        props.colorList&&defData.coverCode&&
            props.colorList.cover.find(item=>item.option===defData.coverCode).content)
        }catch{}
    },[props.colorList])  

    var row01="";
   try{row01=defData.odMain&&defData.odMain!==",,,,"&&
        ["R"].concat(defData.odMain&&defData.odMain.split(',')).concat('')
             .concat(defData.odMore&&defData.odMore.split(','));}catch{}
    var row02="";
    try{ row02=defData.osMain&&defData.osMain!==",,,,"&&
        ["L"].concat(defData.osMain&&defData.osMain.split(',')).concat('')
             .concat(defData.osMore&&defData.osMore.split(','));}catch{}
    const frameRow=defData&&defData.frameSize&&defData.frameSize.split(',');//["","-","-","-","-","-","-","-","-"];
    //console.log(row01)
    return(
        <div className="orderDataHolder">
            {/*env.touch*/}
            <div className="tableHolder">
                <table className="orderTable" style={{direction:"ltr"}}>
                <tbody>
                    <tr>
                        {options.map((th,i)=>(
                        <th key={i}>{th}</th>))}
                    </tr>
                    {row01&&<tr>
                        {row01.map((td,i)=>(
                        <td key={i}>{td?td:i===2?"0.00":""}</td>))}
                        <td>{frameRow&&frameRow[4]}</td>
                    </tr>}
                    {row02&&<tr>
                        {row02&&row02.map((td,i)=>(
                        <td key={i}>{td?td:i===2?"0.00":""}</td>))}
                        <td>{frameRow&&frameRow[4]}</td>
                    </tr>}
                </tbody>
            </table></div>
            {lenzDetail&&<div className="tableHolder"><table className="orderTable" style={{direction:"ltr"}}>
                <tbody>
                    <tr style={{height:"40px"}}>
                        <td width="70%" style={{direction: "ltr"}}>
                            {lenzDetail.facoryName + " | "+
                            lenzDetail.lenzType + " | "+
                            lenzDetail.lenzDesign + " | "+
                            lenzDetail.lenzIndex + " | "+
                            lenzDetail.material} </td>
                        <td width="25%">{"نوع و مشخصات عدسی"}</td>
                    </tr>
                </tbody>
            </table></div>}
            <div className="tableHolder"><table className="orderTable" style={{marginTop:"8px"}}>
                <tbody>
                    <tr>
                        {frameOptions.map((th,i)=>(
                            <th key={i}>{th}</th>))}
                        {lenzDetail&&<td style={{fontSize: "25px"}} rowSpan="2">{lenzDetail.brandName}</td>}
                        {defData&&defData.coridor&&<td  rowSpan="2" dangerouslySetInnerHTML={{__html:
                        defData.coridor?("کریدور<br/> "+defData.coridor):""}}></td>}
                    </tr>
                    {frameRow&&!defData.coridor&&<tr>
                        <td id="HBOX">{frameRow[0]}</td>
                        <td id="VBOX">{frameRow[1]}</td>
                        <td id="BVD">{frameRow[5]}</td>
                        <td id="DBL">{frameRow[2]}</td>
                        <td id="ED">{frameRow[8]}</td>
                        <td id="PT">{frameRow[6]}</td>
                        <td id="FH">{frameRow[3]}</td>
                        <td id="Base">{frameRow[9]}</td>
                        
                    </tr>}
                </tbody>
            </table></div>
            <div className="tableHolder"><table className="orderTable" style={{marginTop:"8px"}}>
                <tbody className="mobileTbody">
                    <tr className="mobileGrid">
                        <td>مصرف کننده: {defData&&defData.consumer}</td>
                        <td>نوع فریم: {defData&&defData.frameType}</td>
                        <td style={{direction:"rtl"}}>پوشش: {defData&&defData.coverCode}
                        ({coverContent})
                        </td>
                    </tr>
                </tbody>
            </table></div>
            <table className="orderTable" style={{marginTop:"8px"}}>
                <tbody>
                    <tr style={{height:"60px",textAlign:"right",direction:"rtl",padding:"10px"}}>
                        <td width="60%" className="moreInfoStyle">
                            {defData?<small>{defData.colorCode?("رنگ: "+defData.colorCode):''}<br/>
                            {defData.mirrorCode?("میرور: "+defData.mirrorCode):''}<br/>
                            {defData.NazokTigh?("خدمات: "+defData.NazokTigh):''}<br/>
                            </small>:<></>}<hr/>
                            {defData&&defData.moreInformation}</td>
                        {props.defData?<td style={{minWidth:"200px"}}><Barcode value={props.defData&&props.defData.rxOrderNo} 
                    format="CODE128" height= {60}/></td>:''}
                    </tr>
                </tbody>
            </table>
            <div className="" style={{marginTop:"10px",minHeight:"20px"}}>
                {defData.frameImg&&defData.frameImg.split(',').map((imgSrc,i)=>(

                imgSrc&&<img key={i} className='imgPreview' src={imgSrc} onClick={()=>setIDisplay(imgSrc)}/>))}
                <ImagePop setIDisplay={setIDisplay} iDisplay={iDisplay}  />
                
            </div>
        </div>
    )
}
export default Preview