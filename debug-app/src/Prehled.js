import {
  StudentM
} from "./entities/persons/student";

import {
  GroupM
} from "./entities/group/Group";

import {
  DepartmentM
} from "./entities/department/Department"

import { CardGroup } from "react-bootstrap";

export default function Prehled(props) {
    return (
        <CardGroup>
            <StudentM id={"765"} name={"Miroslav"} lastname={'Hradecký'} {...props}/>
            <GroupM id={"234"} name={"25-5KB"} {...props}/>
            <DepartmentM id={"4234"} name={"k209"} {...props}/>
        </CardGroup>
    )
}