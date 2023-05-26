import "../styles/Header.css";
import Image from "./Logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <img className="header__icon" src={Image} alt="Analytics_Edge" />
      </Link>

      <div className="innerSpan">
        <span>
          <Link to="/users" title="users">
            Users{" "}
          </Link>
        </span>
        <span>
          <Link to="/posts" title="posts">
            Posts{" "}
          </Link>
        </span>
        <span>
          <Link to="/comments" title="comments">
            Comments{" "}
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Header;
