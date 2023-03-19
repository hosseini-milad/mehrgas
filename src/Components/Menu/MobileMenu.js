function MobileMenu(){
    return(
        <div className="mobileMenu">
            <div className="mobileMenuHolder">
                <a className="mobileMenuItem" href="/order/rx">
                    <i className="icon-size fas fa-calendar-check-o"></i>
                </a>
                <a className="mobileMenuItem" href="/order/stock">
                    <i className="icon-size fas fa-edit"></i>
                </a>
                <a className="mobileMenuItem mobileMenuMain" href="/">
                    <i className="icon-size fas fa-home"></i>
                </a>
                <a className="mobileMenuItem" href="/profile#orders">
                    <i className="icon-size fas fa-search"></i>
                </a>
                <a className="mobileMenuItem" href="/profile#account">
                    <i className="icon-size fas fa-user-o"></i>
                </a>
            </div>
        </div>
    )
}
export default MobileMenu