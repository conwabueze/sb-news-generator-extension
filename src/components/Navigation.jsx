import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function Navigation(){
    return (
        <>
        <div className="nav-title"> What kind of news would you like to generate?</div>
        <Link to="/get-token" className="back-button"><AiOutlineArrowLeft/></Link>
        <nav className="navigation">
            <ul>
                <li><Link to="/get-linkedin-article">Generate Articles from LinkedIn</Link></li>
                <li><Link to="/get-linkedin-updates">Generate Updates from LinkedIn</Link></li>
            </ul>
        </nav>
        </>
    );
}