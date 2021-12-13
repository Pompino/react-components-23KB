import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";

export function DepartmentS (props) {
    return (
        <Link to={props.appRoot+"/department/"+props.id}>{props.name}</Link>
    )
}

export function DepartmentM (props) {
    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <Card.Title>Katedra <DepartmentS {...props} />, ID:{props.id}</Card.Title>
                </Card.Header>
                <Card.Text>
                    Doplnit ... 
                </Card.Text>
            </Card.Body>
        </Card> 
    )
}

export function DepartmentL (props) {

}