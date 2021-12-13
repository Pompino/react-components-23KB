import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";

import {
  StudentL
} from "./entities/persons/student";

import {
  GroupL
} from "./entities/group/Group";

import {
  DepartmentM
} from "./entities/department/Department"

import Home from "./Home";
import Prehled from "./Prehled";

function Separate(props) {
  const {id}=useParams();
  const {type}=useParams();

  if(type==='student') {
    return (<StudentL id={id} name={'Josef'} lastname={'Vrba'} appRoot={props.appRoot}/>)
  }
  else if(type==='group') {
    return (<GroupL id={id} name={'23/5KB'} appRoot={props.appRoot}/>)
  }
  else if (type==='department') {
    return (<DepartmentM id={id} name={'K209'} appRoot={props.appRoot} />)
  }
}

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<Home appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/:type/:id'} element={<Separate appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/prehled'} element={<Prehled appRoot={props.appRoot}/>} />
      </Routes>
    </Router>
  );
}