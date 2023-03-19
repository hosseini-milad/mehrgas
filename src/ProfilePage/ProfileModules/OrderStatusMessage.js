function OrderStatusMessage(props){
    //console.log(props)
    return(
        <div className="profileOrderInfo">
            {!props.status.includes("cancel")&&<>
            <span>تاریخ ثبت: {props.pWeek} {props.pDate}<small> ({props.rawDate}) </small></span>
            </>}
            {props.status.includes("cancel")&&<>
            <span>تاریخ لغو: {props.pWeek} {props.pDate}</span>
            </>}
            <br/><small>
                {props.access==="factory"?"":props.user&&props.user.userInfo?
                `${props.user.userInfo.userName} (${props.user.userInfo.phone})`:props.user.phone}
                </small>
        </div>
    )
}
export default OrderStatusMessage