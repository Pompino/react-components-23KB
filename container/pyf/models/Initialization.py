from types import MappingProxyType
from functools import cache
import types

from models.GroupRelated.UserModel import UserModel
from models.GroupRelated.GroupModel import GroupModel 
from models.GroupRelated.RoleModel import RoleModel
from models.GroupRelated.GroupTypeModel import GroupTypeModel
from models.GroupRelated.RoleTypeModel import RoleTypeModel
from models.GroupRelated.UserGroupModel import UserGroupModel

@cache
def ensureData(SessionMaker=None, session=None):
    def ensureDataItem(session, Model, name):
        itemRecords = session.query(Model).filter(Model.name == name).all()
        itemRecordsLen = len(itemRecords)
        if itemRecordsLen == 0:
            itemRecord = Model(name=name)
            session.add(itemRecord)
            session.commit()
        else:
            assert itemRecordsLen == 1, f'Database has inconsistencies {Model}, {name}'
            itemRecord = itemRecords[0]
        return itemRecord.id

    session = SessionMaker() if session is None else session
    try:
        departmentTypeId = ensureDataItem(session, GroupTypeModel, 'department')
        facultyTypeId = ensureDataItem(session, GroupTypeModel, 'faculty')
        studyGroupId =  ensureDataItem(session, GroupTypeModel, 'studygroup')
        universityTypeId = ensureDataItem(session, GroupTypeModel, 'university')

        departmentHeadRoleTypeId = ensureDataItem(session, RoleTypeModel, 'head of department')
        deanRoleTypeId = ensureDataItem(session, RoleTypeModel, 'dean')
        viceDeanRoleTypeId = ensureDataItem(session, RoleTypeModel, 'vice dean')
        rectorRoleTypeId = ensureDataItem(session, RoleTypeModel, 'rector')
        viceRectorRoleTypeId = ensureDataItem(session, RoleTypeModel, 'vice rector')

        result = {
            'departmentTypeId': departmentTypeId,
            'facultyTypeId': facultyTypeId,
            'studyGroupId': studyGroupId,
            'universityTypeId': universityTypeId,
            'departmentHeadRoleTypeId': departmentHeadRoleTypeId,
            'deanRoleTypeId': deanRoleTypeId,
            'viceDeanRoleTypeId': viceDeanRoleTypeId,
            'rectorRoleTypeId': rectorRoleTypeId,
            'viceRectorRoleTypeId': viceRectorRoleTypeId
        }    
    finally:
        session.close()
    return MappingProxyType(result)

import random
def randomUser(mod='main'):
    surNames = [
        'Novák', 'Nováková', 'Svobodová', 'Svoboda', 'Novotná',
        'Novotný', 'Dvořáková', 'Dvořák', 'Černá', 'Černý', 
        'Procházková', 'Procházka', 'Kučerová', 'Kučera', 'Veselá',
        'Veselý', 'Horáková', 'Krejčí', 'Horák', 'Němcová', 
        'Marková', 'Němec', 'Pokorná', 'Pospíšilová','Marek'
    ]

    names = [
        'Jiří', 'Jan', 'Petr', 'Jana', 'Marie', 'Josef',
        'Pavel', 'Martin', 'Tomáš', 'Jaroslav', 'Eva',
        'Miroslav', 'Hana', 'Anna', 'Zdeněk', 'Václav',
        'Michal', 'František', 'Lenka', 'Kateřina',
        'Lucie', 'Jakub', 'Milan', 'Věra', 'Alena'
    ]

    name1 = random.choice(names)
    name2 = random.choice(names)
    name3 = random.choice(surNames)
    email = f'{name1}.{name2}.{name3}@{mod}.university.world'
    return {'name': f'{name1} {name2}', 'surname': name3, 'email': email}

def CreateRandomUniversity(SessionMaker=None, session=None):
    if session is None:
        if SessionMaker is None:
            print('PopulateRandomData failed')
            return
        session = SessionMaker()
    
    try:
        
        typeIds = ensureData(session=session)
        
        allTeachersGroup = GroupModel(name='teachers')
        allStudentsGroup = GroupModel(name='students')

        session.add(allTeachersGroup)
        session.add(allStudentsGroup)
        session.commit()
        
        def RandomizedStudents(university, faculty, studyGroup, count=10):
            for _ in range(count):
                student = randomUser(mod=faculty.name)
                studentRecord = UserModel(**student)
                session.add(studentRecord)
                faculty.users.append(studentRecord)
                studyGroup.users.append(studentRecord)
                allStudentsGroup.users.append(studentRecord)
                university.users.append(studentRecord)
            session.commit()
        
        def RandomizedStudyGroup(university, faculty):
            strs = ['KB', 'BSV', 'ASV', 'ZM', 'IT', 'EL', 'ST', 'GEO', 'MET']
            appendixes = ['', '-K', '-C', '-O', '-V', '-X']
            name = f"{faculty.name}5-{random.choice([1, 2, 3, 4, 5])}{random.choice(strs)}{random.choice(appendixes)}"
            studyGroupRecord = GroupModel(name=name, grouptype_id=typeIds['studyGroupId'])
            session.add(studyGroupRecord)
            session.commit()
            RandomizedStudents(university, faculty, studyGroupRecord, count=random.randint(5, 15))
            return studyGroupRecord
        
        def RandomizedTeachers(university, faculty, department, count=10):
            for _ in range(count):
                teacher = randomUser(mod=faculty.name)
                teacherRecord = UserModel(**teacher)
                session.add(teacherRecord)
                faculty.users.append(teacherRecord)
                department.users.append(teacherRecord)
                allTeachersGroup.users.append(teacherRecord)
                university.users.append(teacherRecord)
            session.commit()
            
        def RandomizedDepartment(university, faculty, index):
            strs = ['KB', 'BSV', 'ASV', 'ZM', 'IT', 'EL', 'ST', 'GEO', 'MET']
            name = f"{faculty.name}_{index}_{random.choice(strs)}"
            departmentRecord = GroupModel(name=name, grouptype_id=typeIds['departmentTypeId'])
            session.add(departmentRecord)
            session.commit()
            RandomizedTeachers(university, faculty, departmentRecord, count=random.randint(5, 20))
            rolerecord = RoleModel(user=departmentRecord.users[0], group=departmentRecord, grouptype_id=typeIds['departmentHeadRoleTypeId'])
            session.add(rolerecord)
            departmentRecord.roles.append(rolerecord)
            session.commit()
            return departmentRecord
        
        def RandomizedFaculty(university, index):
            facultyGroup = GroupModel(name=f'F{index}', grouptype_id=typeIds['facultyTypeId'])
            session.add(facultyGroup)
            session.commit()
            departmentCount = random.randrange(4, 14)
            for _ in range(departmentCount):
                RandomizedDepartment(university, facultyGroup, index=_)
            studyGroupCount = random.randrange(20, 40)
            for _ in range(studyGroupCount):
                RandomizedStudyGroup(university, facultyGroup)
            session.commit()
            rolerecord = RoleModel(user=facultyGroup.users[0], group=facultyGroup, grouptype_id=typeIds['deanRoleTypeId'])
            session.add(rolerecord)
            facultyGroup.roles.append(rolerecord)
            session.commit()
            return facultyGroup
        
        def RandomizedUniversity():
            universityGroup = GroupModel(name='university', grouptype_id=typeIds['universityTypeId'])
            facultyCount = random.randrange(3, 7)
            for index in range(facultyCount):
                RandomizedFaculty(index)
            session.commit()

            return universityGroup
            
        RandomizedUniversity()
        session.commit()
    finally:
        session.close()    
    pass

from models.AcreditationRelated.ProgramModel import ProgramModel
from models.AcreditationRelated.SubjectModel import SubjectModel
from models.AcreditationRelated.SubjectSemesterModel import SubjectSemesterModel
from models.AcreditationRelated.SubjectTopic import  SubjectTopicModel
from models.AcreditationRelated.AcrediationUserRole import AcreditationUserRoleModel

def CreateRandomStudyProgram(SessionMaker=None, session=None):
    if session is None:
        if SessionMaker is None:
            print('PopulateRandomData failed')
            return
        session = SessionMaker()
    typeIds = ensureData(session=session)
    subjectNames = subjects()

    def GetRandomTeacher(department=None):
        if department is None:
            departments = list(session.query(GroupModel).filter_by(grouptype_id=typeIds['departmentTypeId']))
            department = random.choice(departments)

        teachers = list(session.query(UserGroupModel).filter_by(group_id=department.id))
        dbRecord = random.choice(teachers)
        teacher = dbRecord.user

        return (department, teacher)

    def RandomizeTopic(semester, index, topicSize):
        topic = SubjectTopicModel(name=f'Tema {index}')
        session.add(topic)
        session.commit()

    def RandomizeSemester(subject, index):
        semester = SubjectSemesterModel(name=f'{subject.name} [{index+1}]')
        session.add(semester)
        session.commit()

        semestrLength = random.choice([40, 80, 120])
        total = 0
        index = 0
        while total < semestrLength:
            index = index + 1
            topicSize = random.choice([2, 4, 6, 8])
            if topicSize + total > semestrLength:
                topicSize = semestrLength - total
            total = total + topicSize
            RandomizeTopic(semester, index, topicSize)

    def RandomizeSubject(program):
        subject = SubjectModel(name=random.choice(subjectNames))#, program=program)
        session.add(subject)
        session.commit()
        
        #department, teacher = GetRandomTeacher()
        for index in range(random.randrange(1, 4)):
            RandomizeSemester(subject, index)

    def RandomizeProgram():
        letters = ['B', 'C', 'D', 'E', 'F', 'G', 'H']
        typesA = ['Bc', 'Mgr', 'D']
        typesB = ['P', 'K']
        part1 = random.choice(letters) + random.choice(letters)
        part2 = random.choice(letters) + random.choice(letters)
        part3 = random.choice(letters) + random.choice(letters)
        part4 = random.choice(typesA) + '-' + random.choice(typesB) 
        part5 = random.choice(['2015', '2019', '2020'])
        program = ProgramModel(name=f'{part1}-{part2}-{part3}-{part4}-{part5}')
        session.add(program)
        session.commit()

        for index in range(random.randrange(10, 20)):
            RandomizeSubject(program)


    try:
        typeIds = ensureData(session=session)
        RandomizeProgram()
    finally:
        session.close()    
    pass

def subjects():
    
    data = """3D optická digitalizace 1
Agentní a multiagentní systémy
Aktuální témata grafického designu
Algebra
Algoritmy
Algoritmy (v angličtině)
Analogová elektronika 1
Analogová elektronika 2
Analogová technika
Analýza a návrh informačních systémů
Analýza binárního kódu
Analýza systémů založená na modelech
Anglická konverzace na aktuální témata
Anglická konverzace na aktuální témata
Angličtina 1: mírně pokročilí 1
Angličtina 2: mírně pokročilí 2
Angličtina 3: středně pokročilí 1
Angličtina 3: středně pokročilí 1
Angličtina 4: středně pokročilí 2
Angličtina 4: středně pokročilí 2
Angličtina pro doktorandy
Angličtina pro Evropu
Angličtina pro Evropu
Angličtina pro IT
Angličtina pro IT
Angličtina: praktický kurz obchodní konverzace a prezentace
Aplikace paralelních počítačů
Aplikovaná herní studia - výzkum a design
Aplikované evoluční algoritmy
Architektura 20. století
Architektury výpočetních systémů
Audio elektronika
Automatizované testování a dynamická analýza
Autorská práva - letní
Bakalářská práce
Bakalářská práce Erasmus (v angličtině)
Bayesovské modely pro strojové učení (v angličtině)
Bezdrátové a mobilní sítě
Bezpečná zařízení
Bezpečnost a počítačové sítě
Bezpečnost informačních systémů
Bezpečnost informačních systémů a kryptografie
Bioinformatika
Bioinformatika
Biologií inspirované počítače
Biometrické systémy
Biometrické systémy (v angličtině)
Blockchainy a decentralizované aplikace
CCNA Kybernetická bezpečnost (v angličtině)
České umění 1. poloviny 20. století v souvislostech - zimní
České umění 2. poloviny 20. století v souvislostech - letní
Chemoinformatika
Číslicové zpracování akustických signálů
Číslicové zpracování signálů (v angličtině)
CNC obrábění / Roboti v umělecké praxi
Daňový systém ČR
Databázové systémy
Databázové systémy (v angličtině)
Dějiny a filozofie techniky
Dějiny a kontexty fotografie 1
Dějiny a kontexty fotografie 2
Dějiny designu 1 - letní
Dějiny designu 1 - zimní
Desktop systémy Microsoft Windows
Digitální forenzní analýza (v angličtině)
Digitální marketing a sociální média (v angličtině)
Digitální sochařství - 3D tisk 1
Digitální sochařství - 3D tisk 2
Diplomová práce
Diplomová práce (v angličtině)
Diplomová práce Erasmus (v angličtině)
Diskrétní matematika
Dynamické jazyky
Ekonomie informačních produktů
Elektroakustika 1
Elektronický obchod (v angličtině)
Elektronika pro informační technologie
Elektrotechnický seminář
Evoluční a neurální hardware
Evoluční výpočetní techniky
Filozofie a kultura
Finanční analýza
Finanční management pro informatiky
Finanční trhy
Formální analýza programů
Formální jazyky a překladače
Formální jazyky a překladače (v angličtině)
Funkcionální a logické programování
Funkční verifikace číslicových systémů
Fyzika 1 - fyzika pro audio inženýrství
Fyzika v elektrotechnice (v angličtině)
Fyzikální optika
Fyzikální optika (v angličtině)
Fyzikální seminář
Grafická a zvuková rozhraní a normy
Grafická uživatelská rozhraní v Javě
Grafická uživatelská rozhraní v Javě (v angličtině)
Grafická uživatelská rozhraní v X Window
Grafické a multimediální procesory
Grafové algoritmy
Grafové algoritmy (v angličtině)
Hardware/Software Codesign
Hardware/Software Codesign (v angličtině)
Herní studia
Informační systémy
Informační výchova a gramotnost
Inteligentní systémy
Inteligentní systémy
Internetové aplikace
Inženýrská pedagogika a didaktika
Inženýrská pedagogika a didaktika
Jazyk C
Klasifikace a rozpoznávání
Kódování a komprese dat
Komunikační systémy pro IoT
Konvoluční neuronové sítě
Kritická analýza digitálních her
Kruhové konzultace
Kryptografie
Kultura projevu a tvorba textů
Kultura projevu a tvorba textů
Kurz pornostudií
Lineární algebra
Lineární algebra
Logika
Makroekonomie
Management
Management projektů
Manažerská komunikace a prezentace
Manažerská komunikace a prezentace
Manažerské vedení lidí a řízení času
Manažerské vedení lidí a řízení času
Matematická analýza 1
Matematická analýza 2
Matematická logika
Matematické struktury v informatice (v angličtině)
Matematické výpočty pomocí MAPLE
Matematické základy fuzzy logiky
Matematický seminář
Matematický software
Matematika 2
Maticový a tenzorový počet
Mechanika a akustika
Mikroekonomie
Mikroprocesorové a vestavěné systémy
Mikroprocesorové a vestavěné systémy (v angličtině)
Mobilní roboty
Modelování a simulace
Modelování a simulace
Moderní matematické metody v informatice
Moderní metody zobrazování 3D scény
Moderní metody zpracování řeči
Moderní teoretická informatika
Moderní trendy informatiky (v angličtině)
Molekulární biologie
Molekulární genetika
Multimédia
Multimédia (v angličtině)
Multimédia v počítačových sítích
Návrh a implementace IT služeb
Návrh a realizace elektronických přístrojů
Návrh číslicových systémů
Návrh číslicových systémů (v angličtině)
Návrh kyberfyzikálních systémů (v angličtině)
Návrh počítačových systémů
Návrh vestavěných systémů
Návrh, správa a bezpečnost
Operační systémy
Optické sítě
Optika
Optimalizace
Optimalizační metody a teorie hromadné obsluhy
Optimální řízení a identifikace
Paralelní a distribuované algoritmy
Paralelní výpočty na GPU
Pedagogická psychologie
Pedagogická psychologie
Plošné spoje a povrchová montáž
Počítačová fyzika I
Počítačová fyzika II
Počítačová grafika
Počítačová grafika
Počítačová grafika (v angličtině)
Počítačová podpora konstruování
Počítačové komunikace a sítě
Počítačové vidění (v angličtině)
Počítačový seminář
Podnikatelská laboratoř
Podnikatelské minimum
Pokročilá bioinformatika
Pokročilá matematika
Pokročilá počítačová grafika (v angličtině)
Pokročilá témata administrace operačního systému Linux
Pokročilé asemblery
Pokročilé biometrické systémy
Pokročilé číslicové systémy
Pokročilé databázové systémy
Pokročilé databázové systémy (v angličtině)
Pokročilé informační systémy
Pokročilé komunikační systémy (v angličtině)
Pokročilé operační systémy
Pokročilé směrování v páteřních sítích (ENARSI)
Pokročilé techniky návrhu číslicových systémů
Pokročilý návrh a zabezpečení podnikových sítí
Praktické aspekty vývoje software
Praktické paralelní programování
Pravděpodobnost a statistika
Právní minimum
Právní minimum
Právo informačních systémů
Přenos dat, počítačové sítě a protokoly
Přenos dat, počítačové sítě a protokoly (v angličtině)
Principy a návrh IoT systémů
Principy programovacích jazyků a OOP
Principy programovacích jazyků a OOP (v angličtině)
Principy syntézy testovatelných obvodů
Programovací seminář
Programování na strojové úrovni
Programování v .NET a C#
Programování zařízení Apple
Projektová praxe 1
Projektová praxe 1
Projektová praxe 1 (v angličtině)
Projektová praxe 1 (v angličtině)
Projektová praxe 1 (v angličtině)
Projektová praxe 1 (v angličtině)
Projektová praxe 2
Projektová praxe 2
Projektová praxe 2 (v angličtině)
Projektová praxe 2 (v angličtině)
Projektová praxe 3
Projektování datových sítí
Projektový manažer
Prostředí distribuovaných aplikací
Rádiová komunikace
Regulované gramatiky a automaty
Rétorika
Rétorika
Řízení a regulace 1
Řízení a regulace 2
Robotika (v angličtině)
Robotika a manipulátory
Robotika a zpracování obrazu
Semestrální projekt
Semestrální projekt
Semestrální projekt (v angličtině)
Semestrální projekt Erasmus (v angličtině)
Semestrální projekt Erasmus (v angličtině)
Seminář C#
Seminář C++
Seminář diskrétní matematiky a logiky
Seminář Java
Seminář Java (v angličtině)
Seminář VHDL
Senzory a měření
Serverové systémy Microsoft Windows
Signály a systémy
Simulační nástroje a techniky
Síťová kabeláž a směrování (CCNA1+CCNA2)
Síťové aplikace a správa sítí
Skriptovací jazyky
Složitost (v angličtině)
Směrování a přepínání v páteřních sítích (ENCOR)
Soft Computing
Španělština: začátečníci 1/2
Španělština: začátečníci 2/2
Správa serverů IBM zSeries
Statická analýza a verifikace
Statistika a pravděpodobnost
Statistika, stochastické procesy, operační výzkum
Strategické řízení informačních systémů
Strojové učení a rozpoznávání
Systémová biologie
Systémy odolné proti poruchám
Systémy odolné proti poruchám
Systémy pracující v reálném čase (v angličtině)
Technologie sítí LAN a WAN (CCNA3+4)
Teoretická informatika
Teoretická informatika (v angličtině)
Teorie a aplikace Petriho sítí
Teorie her
Teorie kategorií v informatice
Teorie programovacích jazyků
Testování a dynamická analýza
Tvorba aplikací pro mobilní zařízení (v angličtině)
Tvorba uživatelských rozhraní
Tvorba uživatelských rozhraní (v angličtině)
Tvorba webových stránek
Tvorba webových stránek (v angličtině)
Typografie a publikování
Účetnictví
Ukládání a příprava dat
Umělá inteligence a strojové učení
Úvod do molekulární biologie a genetiky
Úvod do softwarového inženýrství
Uživatelská zkušenost a návrh rozhraní a služeb (v angličtině)
Vědecké publikování od A do Z
Vizualizace a CAD (v angličtině)
Vizuální styly digitálních her 1
Vizuální styly digitálních her 2
Vybraná témata z analýzy a překladu jazyků
Vybrané kapitoly z matematiky
Vybrané partie z matematiky I.
Vybrané partie z matematiky II.
Vybrané problémy informačních systémů
Výpočetní fotografie
Výpočetní geometrie
Výpočetní geometrie (v angličtině)
Vysoce náročné výpočty
Vysoce náročné výpočty
Vysoce náročné výpočty (v angličtině)
Výstavba překladačů (v angličtině)
Výtvarná informatika
Zabezpečovací systémy
Zahraniční odborná praxe
Zahraniční odborná praxe
Základy ekonomiky podniku
Základy financování
Základy herního vývoje
Základy hudební akustiky
Základy marketingu
Základy počítačové grafiky
Základy programování
Základy umělé inteligence
Základy umělé inteligence (v angličtině)
Získávání znalostí z databází
Zkouška z jazyka anglického pro Ph.D.
Zobrazovací systémy v lékařství
Zpracování a vizualizace dat v prostředí Python
Zpracování obrazu
Zpracování obrazu (v angličtině)
Zpracování přirozeného jazyka
Zpracování přirozeného jazyka (v angličtině)
Zpracování řeči a audia člověkem a počítačem
Zpracování řečových signálů
Zpracování řečových signálů (v angličtině)
Zvukový software"""
    
    return data.splitlines()