import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Row } from "react-bootstrap";

export function PersonS(props) {
    const url='/ui/person/m/'+ props.id;
    return (
        <Link to={url}>{props.name} {props.lastname}</Link>
    )
}

export function PersonM(props) {
    return (
        <Card>
            <Card.Header>{props.role ? props.role : 'user'}</Card.Header>
            <Card.Body>
                <Card.Title><PersonS id={props.id} name={props.name} lastname={props.lastname} /></Card.Title>
                <Card.Text>
                    <Row>Jmeno:     Prijmeni:   </Row>
                    <Row>Titul:     Rocnik:     Skupina:    </Row>
                    <Row>E-mail: Telefon: </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}