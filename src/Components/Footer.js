import MobileMenu from "./Menu/MobileMenu";

const Footer = (props)=>{
    const categories=props.data;
    const url = document.location.pathname;
    return(
        <footer>
            <div className="topFooter">
                <a href={`mailto: mehrgaz@gmail.com}`}>
                    <i className="icon-size fas fa-envelope-o"></i></a>
                <a href={"https://instagram.com/mehrgas.co"}>
                    <i className="icon-size fas fa-instagram"></i></a>
                
                <a href={`tel:02691091026`}>
                        <i className="icon-size fas fa-phone"></i>
                        <span className="phoneNumber">026-91091026</span></a>
            </div>
            <div className="mainFooter">
                <div className="footerAbout">
                    <img src="/logo.svg" alt="logo"/>
                    <p dangerouslySetInnerHTML={{__html:
                    "شرکت مهرگاز (با مسئولیت محدود) در دی ماه سال ۱۳۷۵ با هدف توزیع گاز مایع در استان البرز تاسیس شد. این شرکت یکی از توزیع کنندگان اصلی گازمایع در سطح استانهای البرز، قزوین و زنجان میباشد که با بهره گیری از چرخه کامل تامین و توزیع نسبت به برداشت و حمل سهمیه تخصیصی از مبادی پالایشگاهی و توزیع در مقاصد توسط شبکه توزیع اقدام مینماید. این شرکت که نامی آشنا در صنعت گازمایع کشور میباشد طی بیش از بیست سال از حیات خود در عرصه سوخت‌رسانی، کوشیده است با ارتقاء کیفی عرضه بی وقفه خدمات به مصرف‌کنندگان در راستای تحقق اصل مشتری مداری، موجبات رضایتمندی آنان را فراهم آورد."}}>
                    
                    </p>
                </div>
                <div className="footerMenu">
                    <ul className="footerUl">
                        {categories&&categories.category.map((cat,i)=>(
                            <li key={i} onClick={()=>window.location.href="/order"}>{cat.title}</li>
                        ))}
                    </ul>
                </div>
                <div className="footerMenu">
                    <ul className="footerUl">
                        <li onClick={()=>window.location.href="/order"}>سفارش آنلاین</li>
                        <a href="https://dkmehr.com/adv">
                            <img src="/img/dkmehradv.png" alt="dkmehr adv"/>
                        </a>
                    </ul>
                </div>
                <div className="footerMenu">
                    {/*<img src="/img/enamad.png" alt="enamad"/>*/}
                    <a referrerPolicy='origin' target='_blank' 
                        href='https://trustseal.enamad.ir/?id=433684&Code=n5rfC1ArHLSM7qeUk7LSPsH4adJrHVX5'><img referrerPolicy='origin' 
                        src='https://trustseal.enamad.ir/logo.aspx?id=433684&Code=n5rfC1ArHLSM7qeUk7LSPsH4adJrHVX5' alt='' 
                        style={{cursor:"pointer"}} Code='n5rfC1ArHLSM7qeUk7LSPsH4adJrHVX5'/></a>
                </div>
            </div>
            <div className="topFooter" style={{color: "#fff", padding: "5px"}}>
                طراحی و پیاده سازی:
                <a href="https://dkmehr.com">داده کاوان مهر البرز</a>
            </div>
            {url==="/login"?"":<MobileMenu />}
            
        </footer>
    )
}
export default Footer