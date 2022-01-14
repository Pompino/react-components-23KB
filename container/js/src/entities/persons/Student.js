import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import image from './rozvrhSnimek.png'
import { GroupS } from "../group/Group";
import { FacultyS } from "../faculty/Faculty";
import { TeacherS } from "./Teacher";

export function StudentS(props) {
    return (
        <Link to={props.appRoot + "/student/" + (props.id + 1)}>{props.name} {props.lastname}</Link>
    )
}

export function StudentM(props) {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Student - <StudentS {...props} /></Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <b>Jméno  příjmení:</b> {props.name} {props.lastname}<br />
                    <b>Titul:</b> {props.degreeRank} <b>Ročník:</b> {props.grade} <br />
                    <b>Skupina:</b> {props.groups}<br />
                    <b>Fakulta:</b> {props.faculties}
                </Card.Text>
            </Card.Body>
        </div>
    )
}

export function StudentL(props) {
    let faculties = props.faculty.map((item) => (<FacultyS key={item.id} {...item} appRoot={props.appRoot} />))
    let groups = props.groups.map((item) => (<GroupS key={item.id} {...item} appRoot={props.appRoot} />))
    let subjects = props.subjects.map((item) => (<li key={item.id}><Link key={item.id} to={'404'}>{item.name}</Link></li>))

    return (
        <div className="card w-75">
            <div className="card-header mb-3">
                <h4>Karta uživatele</h4>
            </div>

            <div className="col">
                <Row>
                    <div className="col-3">
                        <StudentM {...props} faculties={faculties} groups={groups} />
                        <ContactInfo {...props} />
                    </div>
                    <div className="col-6">
                        <RozvrhM />
                    </div>
                    <div className="col-3">
                        <SeznamPredmetu subjects={subjects} />
                    </div>
                </Row>
            </div>
        </div>
    )
}

export function StudentPage(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'lastname': props.lastname,
            'degreeRank': 'ing. por.',
            'grade': '3',
            "email": props.name.toLowerCase() + '.' + props.lastname.toLowerCase() + '@unob.cz',
            'phone': '720 525 980',
            'areal': 'Kasárny Černá Pole',
            'building': '3',
            'room': '422',
            'VR': 'def',
            'VC': 'def',
            'VK': 'def',
            'faculty': [
                { 'id': 23, 'name': 'FVT' }
            ],
            'groups': [
                { 'id': 21, 'name': '23-5KB' },
                { 'id': 22, 'name': '24-5KB' }
            ],
            'subjects': [
                { 'id': 25, 'name': 'Informatika' },
                { 'id': 1, 'name': 'Analýza informačních zdrojů' },
                { 'id': 3, 'name': 'Anglický jazyk' },
                { 'id': 2, 'name': 'Tělesná výchova' },
                { 'id': 4, 'name': 'Kybernetická bezpečnost' },
                { 'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost' }
            ]
        }
    )

    useEffect(() => {
        fetch('/gql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            redirect: 'follow', // manual, *follow, error
            body: JSON.stringify({
                "query":
                    `
                query {
                    user(id: ${props.id}) {
                      id
                      name
                      surname
                      email
                      groups: groupsByType(typeId: 1) {
                        id
                        name
                      }
                      faculty: groupsByType(typeId: 2) {
                        id
                        name
                      }
                      subjects: groupsByType(typeId: 0) {
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

    // const groups = []
    // for(index = 0; index < state.groups.length; index++) {
    //     if(index>0) groups.push(', ')
    //     const sgItem = state.groups[index]
    //     groups.push(<GroupS {...props} id={sgItem.id} name={sgItem.name} key={sgItem.id}/>);
    // }

    return (
        <StudentL {...state} {...props} />
    )
}

function RozvrhM() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Týdenní rozvrh</Card.Title>
            </Card.Header>
            <Card.Body>
                <img src={image} alt="Rozvrh" width={'100%'} />
            </Card.Body>
        </Card>
    )
}

function ContactInfo(props) {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Kontaktní údaje</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>E-mail:</b> {props.email}<br />
                <b>Telefon:</b> {props.phone ? props.phone : 'Neuvedeno'}<br />
                <b>Areál: </b> {props.areal}<br />
                <b>Budova: </b>{props.building} <b>Místnost:</b> {props.room}<br />
                <hr />
                <b>Velitel roty:</b> <TeacherS id={23} name='Stanislav' lastname='Dobrušák' appRoot={props.appRoot} /><br />
                <b>Velitel čety:</b> <StudentS id={28} name='Pavel' lastname='Rajská' appRoot={props.appRoot} /><br />
                <b>Vedoucí katedry:</b> <TeacherS id={21} name='František' lastname='Petr' appRoot={props.appRoot} /><br />
            </Card.Body>
        </div>
    )
    // <b>Velitel roty:</b> <PersonS id={23} name='Stanislav' lastname='Dobrušák' appRoot={props.appRoot}/><br />
    // <b>Velitel čety:</b> <PersonS id={28} name='Pavel' lastname='Rajská' appRoot={props.appRoot}/><br />
    // <b>Vedoucí katedry:</b> <PersonS id={21} name='František' lastname='Petr' appRoot={props.appRoot}/><br />

}

function SeznamPredmetu(props) {
    return (
        <div className="card mb-3">
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