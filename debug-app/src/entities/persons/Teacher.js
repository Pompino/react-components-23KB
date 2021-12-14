import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import image from './rozvrhSnimek.png'
import { DepartmentS } from "../department/Department";

export function TeacherS(props) {
    return (
        <Link to={props.appRoot+"/teacher/"+(props.id+1)}>{props.name} {props.lastname}</Link>
    )
}

export function TeacherM(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Vyučující - <TeacherS {...props} /></Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <b>Jméno příjmení:</b> {props.name} {props.lastname}<br/>
                    <b>Titul:</b> {props.degreeRank ? props.degreeRank : 'mgr. npor.'}<br/>
                    <b>Katedra:</b> {props.departments ? props.departments : <Link to={'404'}>K-209</Link>}<br/>
                    <b>Fakulta:</b> {props.faculty ? props.faculty : <Link to={'404'}>FVZ</Link>}
                </Card.Text>
            </Card.Body>
        </div>
    )
}

export function TeacherL(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'lastname': props.lastname,
            'degreeRank': 'ing. plk.',
            "email": props.name.toLowerCase()+'.'+props.lastname.toLowerCase()+'1@unob.cz',
            'phone': '973 274 160',
            'areal': 'Kasárny Šumavská',
            'building': '5',
            'room': '104',
            'faculty': [
                {'id': 23, 'name': 'FVT'}
            ],
            'departments': [
                {'id': 1, 'name': 'K-209'},
                {'id': 2, 'name': 'K-207'}
            ],
            'subjects': [
                {'id': 25, 'name': 'Informatika'},
                {'id': 1, 'name': 'Analýza informačních zdrojů'},
                {'id': 4, 'name': 'Kybernetická bezpečnost'},
                {'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost'}
            ]
        }
    )

    useEffect(()=>{
        fetch('/api/getTeacher/', {
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
                        lastname
                        degreeRank
                        email
                        phone
                        areal
                        building
                        room
                        faculty: groupsByType(type: 0) {
                            id
                            name
                        }
                        departments: groupsByType(type: 1) {
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

    const departments = []
    for(index = 0; index < state.departments.length; index++) {
        if(index>0) {
            departments.push(', ');
        }
        const sgItem = state.departments[index]
        departments.push(<DepartmentS {...props} id={sgItem.id} name={sgItem.name} />);
    }

    return (
        <div class="card w-75">
            <div class="card-header mb-3">
                <h4>Karta uživatele</h4>
            </div>
            <Row>
                <div class="col-3">
                    <TeacherM {...props} degreeRank={state.degreeRank} departments={departments}/>
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