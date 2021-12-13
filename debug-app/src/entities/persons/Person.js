import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import image from './rozvrhSnimek.png'

export function PersonS(props) {
    return (
        <Link to={props.appRoot+"/person/"+(props.id+1)}>{props.name} {props.lastname}</Link>
    )
}

export function PersonM(props) {
    return (
        <Card>
            <Card.Header>
                <Card.Title><PersonS {...props} /></Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    Jmeno: {props.name} Prijmeni: {props.lastname}<br/>
                    Titul: {props.degreeRank ? props.degreeRank : 'mgr. npor.'} <br/>
                    Rocnik: {props.grade ? props.grade : '3.'} Skupina: {props.group ? props.group : '21-5KB'}<br/>
                    E-mail: Telefon:
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export function PersonL(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'degreeRank': 'ing. por.',
            'faculty': [
                {'id': 23, 'name': 'FVT'}
            ],
            'group': [
                {'id': 21, 'name': '23-5KB'}
            ],
            'subjects': [
                {'id': 25, 'name': 'Informatika'},
                {'id': 1, 'name': 'Analýza informačních zdrojů'},
                {'id': 3, 'name': 'Anglický jazyk'}
            ]
        }
    )

    useEffect(()=>{
        fetch('/api/getPerson/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 
                `
                query {
                    user(id: $id$) {
                        id
                        externalId
                        name
                        surname
                        fullname
                        faculty: groupsByType(type: 0) {
                            id
                            name
                        }
                        group: groupsByType(type: 1) {
                            id
                            name
                        }
                        subjects: groupsByType(type: 2) {
                            id
                            name
                        }
                    }
                }
                `
            }),
        })
        .then(response => response.json())
        .then(data => setState(data.data))
        .then(() => console.log('data logged'))
        .catch(error => console.log('error nacteni'))
    }, [props.id])

    const subjects = []
    for(var index = 0; index < state.subjects.length; index++) {
        const sgItem = state.subjects[index]
        subjects.push(<Link to={'404'}>{sgItem.id} {sgItem.name}</Link>);
        subjects.push(<br />);
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Karta uživatele</Card.Title>
            </Card.Header>
            <Row>
                <div><br/></div>
            </Row>
            <Row>
                <Col>
                    <PersonM {...props} degreeRank={state.degreeRank} group={state.group[0]['name']}/>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Karta uživatele</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            Text, text <br />
                            {state.degreeRank}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <RozvrhM />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Predmety</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {subjects}
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Card>
    )
}

function RozvrhM() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Rozvrh tento tyden</Card.Title>
            </Card.Header>
            <Card.Body>
                <img src={image} alt="Rozvrh" />
            </Card.Body>
        </Card>
    )
}