import Nav from "../../components/Nav";
import "./Layout.scss";



export default function Layout(props: any) {


  return (
    <div className="layout">
      {props.children}
      <Nav />
    </div>
  );
}