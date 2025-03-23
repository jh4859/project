import { Link } from "react-router-dom";
import logo from "../img/logo.png";

let Nav = () => {
    return(
      <>
        <header>
            <nav>
                <div className="menu">
                    <div className="menu-left">
                        <div className="menu-logo">
                            <Link to={'/cafelist'}>
                            <img src={logo} alt="로고" />
                            </Link>
                        </div>
                        <div className="menu-store">
                            <Link to={'/cafelist'}>STORE</Link>
                            <Link to={'/community'}>COMMUNITY</Link>
                        </div>
                    </div>
                    <div className="menu-right">
                        <div className="menu-login">
                        <Link to={'/login'}>LOGIN</Link>
                        <Link to={'/register'}>JOIN</Link>
                        <Link to={'/mypage'}>MY PAGE</Link>
                        </div>
                        <div className="social-icons">
                        <Link to='https://www.instagram.com/'><i class="fa-brands fa-instagram"></i></Link>
                        <Link to='https://www.facebook.com/'><i class="fa-brands fa-square-facebook"></i></Link>
                        <Link to='https://x.com/'><i class="fa-brands fa-square-x-twitter"></i></Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <div className="hero">
          <div className="hero-section">
              <div className="hero-content">
                  <p>COMMUNITY</p>
                  <p>좋은 커피와 서비스를 제공하는 카페 정보를 제공합니다</p>
              </div>
          </div>
        </div>

        <div className="second">
            <div className="second-section">
              <Link to={'/cafelist'}>카페정보</Link>
              <Link to={'/cafelist'}>메뉴</Link>
            </div>
        </div>
        <hr />
      </>      
    )
  }

export default Nav;