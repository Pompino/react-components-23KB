import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";

import { StudentPage } from "./entities/persons/Student";
import { TeacherPage } from "./entities/persons/Teacher";
import { GroupPage } from "./entities/group/Group";
import { DepartmentPage } from "./entities/department/Department"
import { FacultyPage } from "./entities/faculty/Faculty";

import Home from "./Home";
import Prehled from "./Prehled";
import { PersonL } from "./entities/persons/Person";



function Separate(props) {
  const { id } = useParams();
  const { type } = useParams();

  if (type === 'student') {
    return (<StudentPage id={id} name={'Josef'} lastname={'Vrba'} appRoot={props.appRoot} />)
  }
  else if (type === 'group') {
    return (<GroupPage id={id} name={'23-5KB'} appRoot={props.appRoot} />)
  }
  else if (type === 'department') {
    return (<DepartmentPage id={id} name={'K-209'} appRoot={props.appRoot} />)
  }
  else if (type === 'teacher') {
    return (<TeacherPage id={id} name={'Jan'} lastname={'Kolomaz'} appRoot={props.appRoot} />)
  }
  else if (type === 'faculty') {
    return (<FacultyPage id={id} name={'FVK'} appRoot={props.appRoot} />)
  }
}

function BasicPerson(props) {
  const { id } = useParams();

  return (<PersonL id={id} name={'Jan'} lastname={'Kolomaz'} {...props} />)
}

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route path={props.appRoot} element={<Home appRoot={props.appRoot} />} />
        <Route path={props.appRoot + '/:type/:id'} element={<Separate appRoot={props.appRoot} />} />
        <Route path={props.appRoot + '/prehled'} element={<Prehled appRoot={props.appRoot} />} />
        <Route path={props.appRoot + '/person/:id'} element={<BasicPerson appRoot={props.appRoot} />} />
        <Route path={props.appRoot + '/MediumNULL'} element={<div>Z meidum komponent odkazy nefunguji</div>} />
      </Routes>
    </Router>
  );
}