import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { useEffect, useState } from "react";

import image from './rozvrhSnimek.png'
import { StudentS } from "../persons/Student";
import { PersonS } from "../persons/Person";
import { DepartmentS } from "../department/Department";

export function GroupS(props) {
    return (
        <Link to={props.appRoot+"/group/"+props.id}>{props.name}</Link>
    )
}

export function GroupM(props) {
    return (
        <Card className='mb-3'>
            <Card.Header>
                <Card.Title>Skupina <b><GroupS {...props}/></b></Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Fakulta:</b> {props.faculties} <br/>
                <b>Ročník:</b> {props.grade} <br/>
                <b>Obor:</b> {props.specialization}<br/>
                <hr/>
                <b><Link to={props.appRoot+"/MediumNULL"}>Harmonogram studia</Link></b> <br/>
            </Card.Body>
        </Card>
    )
}

export function GroupL(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'grade': '3',
            'specialization': 'Kybernetická bezpečnost',
            'VR': 'def',
            'VC': 'def',
            'VK': 'def',
            'faculty': [
                {'id': 23, 'name': 'FVT'}
            ],
            'subjects': [
                {'id': 25, 'name': 'Informatika'},
                {'id': 1, 'name': 'Analýza informačních zdrojů'},
                {'id': 3, 'name': 'Anglický jazyk'},
                {'id': 2, 'name': 'Tělesná výchova'},
                {'id': 4, 'name': 'Kybernetická bezpečnost'},
                {'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost'}
            ],
            'students': [
                {'id': 1, 'name': 'Honza Bernard'},
                {'id': 2, 'name': 'Pavel Motol'},
                {'id': 3, 'name': 'Dominik Vaněk'},
                {'id': 4, 'name': 'Andrea Svobodova'},
                {'id': 5, 'name': 'Michal Mrkev'},
                {'id': 6, 'name': 'Patrik Němý'},
                {'id': 7, 'name': 'Jiřina Stará'},
                {'id': 8, 'name': 'Petr Filip'},
                {'id': 9, 'name': 'Jiří Grau'},
                {'id': 10, 'name': 'Teodor Velký'},
                {'id': 11, 'name': 'Alexandr Veliký'},
                {'id': 22, 'name': 'Aleš Máchal'}
            ]
        }
    )

    useEffect(()=>{
        fetch('/gql/getStudent/', {
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
                        VR
                        VC
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
                        students: groupsByType(type: 3) {
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
        subjects.push(<li key={sgItem.id}><Link to={'404'}>{sgItem.name}</Link></li>);
    }
    
    const faculties = []
    for(index = 0; index < state.faculty.length; index++) {
        if(index>0) faculties.push(', ')
        const sgItem = state.faculty[index]
        faculties.push(<DepartmentS {...props} id={sgItem.id} name={sgItem.name} key={sgItem.id}/>);
    }

    const students = []
    for(index = 0; index < state.students.length; index++) {
        const sgItem = state.students[index]
        students.push(<li key={sgItem.id}><StudentS {...props} id={sgItem.id} name={sgItem.name} /></li>);
    }

    return (
        <div class="card">
            <div class="card-header mb-3">
                <h4>Karta učební skupiny</h4>
            </div>
            <div class="col">
                <div class='row'>
                    <div class="col-3">
                        <GroupM {...props} grade={state.grade} specialization={state.specialization} faculties={faculties}/>
                        <ContactInfo appRoot={props.appRoot} />

                    </div>
                    <div class="col-2">
                        <SeznamStudentu students={students} />
                    </div>
                    <div class="col-5">
                        <RozvrhM />
                    </div>
                    <div class="col-2">
                        <SeznamPredmetu subjects={subjects} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function RozvrhM() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Týdenní rozrvh</Card.Title>
            </Card.Header>
            <Card.Body>
                <img src={image} alt="Rozvrh" width={'100%'}/>
            </Card.Body>
        </Card>
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

function SeznamStudentu(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Studenti</Card.Title>
            </Card.Header>
            <Card.Body>
                <ul>
                    {props.students}
                </ul>
            </Card.Body>
        </div>
    )
}

function ContactInfo(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Nadřízení</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Velitel roty:</b> <PersonS id={23} name='Stanislav' lastname='Dobrušák' appRoot={props.appRoot}/><br />
                <b>Velitel čety:</b> <PersonS id={28} name='Pavel' lastname='Rajská' appRoot={props.appRoot}/><br />
                <b>Vedoucí katedry:</b> <PersonS id={21} name='František' lastname='Petr' appRoot={props.appRoot}/><br />
            </Card.Body>
        </div>
    )
}