import { StudentM } from "./entities/persons/Student";
import { TeacherM } from "./entities/persons/Teacher";
import { GroupM } from "./entities/group/Group";
import { DepartmentM } from "./entities/department/Department"
import { CardGroup } from "react-bootstrap";
import { FacultyM } from "./entities/faculty/Faculty";
import { Link } from "react-router-dom";


export default function Prehled(props) {
    return (
        <CardGroup>
            <StudentM
                id={"765"}
                name={"Miroslav"}
                lastname={'Hradecký'}
                degreeRank={'mgr. npor.'}
                grade={'2'}
                groups={<Odkaz {...props} text={'21-5KB'} />}
                faculties={<Odkaz {...props} text={'FVP'} />}
                {...props}
            />
            <TeacherM
                id={"765"}
                name={"Jaroslav"}
                lastname={'Zápočet'}
                degreeRank={'ing. plk.'}
                departments={<Odkaz {...props} text={'K-309'} />}
                faculties={<Odkaz {...props} text={'FVW'} />}
                {...props}
            />
            <GroupM
                id={"234"}
                name={"25-5KB"}
                faculties={<Odkaz {...props} text={'FVL'} />}
                grade={'5'}
                specialization={'Draky a motory'}
                {...props}
            />
            <DepartmentM
                id={"4234"}
                name={"K-309"}
                fullname={'Katedra vojenské robotiky'}
                VK={<Odkaz {...props} text={'Jaroslav Strmý'} />}
                FacultyName={"FVR"}
                {...props}
            />
            <FacultyM
                id={234}
                name={'FVZ'}
                fullname={'Fakulta vojenského zdravotnictví'}
                dean={<Odkaz {...props} text={'Jakub Štěpán'} />}
                {...props}
            />
        </CardGroup>
    )
}

function Odkaz(props) {
    return (<Link to={props.appRoot + "/MediumNULL"}>{props.text}</Link>)
}