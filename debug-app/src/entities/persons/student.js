import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import image from './rozvrhSnimek.png'

export function StudentS(props) {
    return (
        <Link to={props.appRoot+"/student/"+(props.id+1)}>{props.name} {props.lastname}</Link>
    )
}

export function StudentM(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Student - <StudentS {...props} /></Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <b>Jméno příjmení:</b> {props.name} {props.lastname}<br/>
                    <b>Titul:</b> {props.degreeRank ? props.degreeRank : 'mgr. npor.'} <b>Ročník:</b> {props.grade ? props.grade : '0'} <br/>
                    <b>Skupina:</b> {props.group ? props.group : <Link to={'404'}>21-5KB</Link>}<br/>
                    <b>Fakulta:</b> {props.faculty ? props.faculty : <Link to={'404'}>FVZ</Link>}
                </Card.Text>
            </Card.Body>
        </div>
    )
}

export function StudentL(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'lastname': props.lastname,
            'degreeRank': 'ing. por.',
            'grade': '3',
            "email": props.name.toLowerCase()+'.'+props.lastname.toLowerCase()+'1@unob.cz',
            'phone': '720 525 980',
            'areal': 'Kasárny Černá Pole',
            'building': '3',
            'room': '422',
            'faculty': [
                {'id': 23, 'name': 'FVT'}
            ],
            'groups': [
                {'id': 21, 'name': '23-5KB'},
                {'id': 22, 'name': '24-5KB'}
            ],
            'subjects': [
                {'id': 25, 'name': 'Informatika'},
                {'id': 1, 'name': 'Analýza informačních zdrojů'},
                {'id': 3, 'name': 'Anglický jazyk'},
                {'id': 2, 'name': 'Tělesná výchova'},
                {'id': 4, 'name': 'Kybernetická bezpečnost'},
                {'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost'}
            ]
        }
    )

    useEffect(()=>{
        fetch('/api/getStudent/', {
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
                        name
                        surname
                        fullname
                        faculty: groupsByType(type: 0) {
                            id
                            name
                        }
                        groups: groupsByType(type: 1) {
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
        subjects.push(<li><Link to={'404'}>{sgItem.name}</Link></li>);
    }

    const groups = []
    for(index = 0; index < state.groups.length; index++) {
        if(index>0) {
            groups.push(', ');
        }
        const sgItem = state.groups[index]
        groups.push(<Link to={'404'}>{sgItem.name}</Link>);
    }

    return (
        <div class="card w-75">
            <div class="card-header mb-3">
                <h4>Karta uživatele</h4>
            </div>

            <Row>
                <div class="col-3">
                    <StudentM {...props} degreeRank={state.degreeRank} grade={state.grade} group={groups}/>
                    <ContactInfo data={state}/>
                </div>
                <div class="col-6">
                    <RozvrhM />
                </div>
                <div class="col-3">
                    <SeznamPredmetu subjects={subjects} />
                </div>
            </Row>
        </div>
    )
}

function RozvrhM() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Rozvrh tento týden</Card.Title>
            </Card.Header>
            <Card.Body>
                <img src={image} alt="Rozvrh" width={'100%'}/>
            </Card.Body>
        </Card>
    )
}

function ContactInfo(props) {
    //data=props.datas;
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Kontaktní údaje</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>E-mail:</b> {props.data.email}<br />
                <b>Telefon:</b> {props.data.phone ? props.data.phone : 'Neuvedeno'}<br />
                <b>Areál: </b> {props.data.areal}<br />
                <b>Budova: </b>{props.data.building} <b>Místnost:</b> {props.data.room}<br />
            </Card.Body>
        </div>
    )
}

function SeznamPredmetu(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Předměty</Card.Title>
            </Card.Header>
            <Card.Body>
                <ul>
                    {props.subjects}
                </ul>
            </Card.Body>
        </div>
    )
}